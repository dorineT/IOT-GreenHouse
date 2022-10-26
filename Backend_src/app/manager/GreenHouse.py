from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field

from Phidget22.PhidgetException import PhidgetException

from app.manager.sensors.errors import NotYetAttachedError
from app.manager.sensors.phidgets import Sensor, SensorType

@dataclass
class GreenHouse:
    sensor_millidelay: int
    sensors: list[tuple[SensorType, Sensor, float | None]] = field(default_factory=list)

    @staticmethod
    def _actualize_one(
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

    def actualize_all(self):
        """Retrieves all the sensor values
        """
        # Phidget's Open method is blocking its thread
        # So, to have async fetches, we need to spawn a thread for each
        # phidget.
        with ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(
                    self._actualize_one,
                    stype,
                    sensor,
                    self.sensor_millidelay)
                for stype, sensor, _ in self.sensors]
            values = [f.result() for f in futures]

        
        self.sensors = [(stype, sensor, nvalue) for (stype, sensor, _), nvalue in zip(self.sensors, values)]
