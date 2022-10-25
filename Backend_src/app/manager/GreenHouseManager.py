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
        self.poll_mindelay: int = poll_mindelay * 60
        self.sensor_millidelay: dict[SensorType, tuple[Sensor, float | None]] = sensor_millidelay

        self.sensors = {
            SensorType.LIGHT: (
                cLightSensor(
                    serial_number=672154, port=0), None),
            SensorType.TEMP: (
                cTempSensor(
                    serial_number=672154, port=2), None)
        }

        super().__init__()

    def _poll(self) -> None:

        def actualize(stype: SensorType, sensor: Sensor, delay: int) -> float | None:
            nvalue = None
            try:
                nvalue = sensor.value(delay)
            except PhidgetException:
                print(f'{stype.value} sent an error')
            except NotYetAttachedError:
                print(f'{stype.value} was not attached')
            return nvalue

        # Phidget's Open method is blocking its thread
        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(actualize, stype, sensor, self.sensor_millidelay) for stype, (sensor, _) in self.sensors.items()]
            values = [f.result() for f in futures]

        for (stype, (sensor, _)), nvalue in zip(self.sensors.items(), values):
            self.sensors[stype] = sensor, nvalue

    def _cron_job(self) -> None:
        # Put here the greenhouse logic
        self._poll()
        self.scheduler.enter(self.poll_mindelay, 1, self._cron_job)


    def run(self) -> None:
        self.scheduler.enter(self.poll_mindelay, 1, self._cron_job)
        self.scheduler.run()

    def summary(self) -> dict[str, float | None]:
        self._poll()
        return {stype.value: value
                for stype, (_, value) in self.sensors.items()}
