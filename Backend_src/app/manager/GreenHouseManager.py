import sched

from time import time, sleep
from threading import Thread

from Phidget22.PhidgetException import PhidgetException

from app.manager.sensors.errors import NotYetAttachedError
from app.manager.sensors.phidgets import SensorType, Sensor
from app.manager.sensors.phidgets import cLightSensor, cTempSensor


class GreenHouseManager(Thread):

    scheduler: sched.scheduler
    poll_secdelay: int
    sensors: dict[SensorType, tuple[Sensor, float | None]]

    def __init__(
            self,
            poll_secdelay: int = 30,
            sensor_millidelay: int = 5000) -> None:

        self.scheduler = sched.scheduler(time, sleep)
        self.poll_secdelay = poll_secdelay
        self.sensor_millidelay = sensor_millidelay

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

        for stype, (sensor, _) in self.sensors.items():
            try:
                self.sensors[stype] = sensor, sensor.value(
                    self.sensor_millidelay)
            except PhidgetException:
                self.sensors[stype] = sensor, None
            except NotYetAttachedError:
                self.sensors[stype] = sensor, None

        self.scheduler.enter(self.poll_secdelay, 1, self._poll)

    def run(self) -> None:
        self.scheduler.enter(self.poll_secdelay, 1, self._poll)
        self.scheduler.run()

    def summary(self) -> dict[str, float | None]:
        # can be called from outside
        return {stype.value: value
                for stype, (_, value) in self.sensors.items()}
