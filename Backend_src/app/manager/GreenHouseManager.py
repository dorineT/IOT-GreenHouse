import sched

from concurrent.futures import ThreadPoolExecutor
from time import time, sleep
from threading import Thread

from Phidget22.PhidgetException import PhidgetException

from app.manager.sensors.errors import NotYetAttachedError
from app.manager.sensors.phidgets import SensorType, Sensor
from app.manager.sensors.phidgets import cLightSensor, cTempSensor


class GreenHouseManager(Thread):

    def __init__(
            self,
            poll_mindelay: int = 30,
            sensor_millidelay: int = 5000) -> None:

        self.scheduler: sched.scheduler = sched.scheduler(time, sleep)
        self.poll_mindelay: int = poll_mindelay * 5
        self.sensor_millidelay: int = sensor_millidelay

        self.sensors: dict[SensorType, tuple[Sensor, float | None]] = {
            SensorType.LIGHT: (
                cLightSensor(
                    serial_number=672154, port=0), None),
            SensorType.TEMP: (
                cTempSensor(
                    serial_number=672154, port=2), None)
        }

        super().__init__()

    def _poll(self) -> None:
        """Retrieves all the sensor values
        """

        def actualize(
                stype: SensorType,
                sensor: Sensor,
                delay: int) -> float | None:
            """Fetches the current sensor value from specified sensor

            :param stype: sensor type
            :type stype: SensorType
            :param sensor: current instance of the sensor in the code
            :type sensor: Sensor
            :param delay: max time to wait until throwing an error
            :type delay: int
            :return: sensor value. None if a problem occured
            :rtype: float | None
            """
            nvalue = None
            try:
                nvalue = sensor.value(delay)
            except PhidgetException:
                print(f'{stype.value} sent an error')
            except NotYetAttachedError:
                print(f'{stype.value} was not attached')
            return nvalue

        # Phidget's Open method is blocking its thread
        # So, to have async fetches, we need to spawn a thread for each
        # phidget.
        with ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(
                    actualize,
                    stype,
                    sensor,
                    self.sensor_millidelay)
                for stype, (sensor, _) in self.sensors.items()]
            values = [f.result() for f in futures]

        for (stype, (sensor, _)), nvalue in zip(self.sensors.items(), values):
            self.sensors[stype] = sensor, nvalue

    def _cron_job(self) -> None:
        """Fetches the sensor values from the phidget and
        computes the green house current state.

        Decides if its necessary to water the green house.
        Displays a minimal summary to the LCD screen
        """
        t0 = time()

        # Put here the greenhouse logic here
        self._poll()

        # Computing time delay necessary to run cron job
        # exactly poll_mindelay minutes after previous one
        elapsed = time() - t0
        ndelay = self.poll_mindelay - elapsed if self.poll_mindelay - elapsed > 0 else 0.0

        # Planning next job
        self.scheduler.enter(ndelay, 1, self._cron_job)

    def run(self) -> None:
        self.scheduler.enter(self.poll_mindelay, 1, self._cron_job)
        self.scheduler.run()

    def summary(self) -> dict[str, float | None]:
        """Returns a user-friendly dictionary containing the last values obtainend from
        the different phidgets. This action forces the actualization of the previous fetched
        values.

        :return: last phidgets values
        :rtype: dict[str, float | None]
        """
        self._poll()
        return {stype.value: value
                for stype, (_, value) in self.sensors.items()}
