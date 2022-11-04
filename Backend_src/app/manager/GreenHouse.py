import logging

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import datetime

from Phidget22.PhidgetException import PhidgetException

from app.manager.sensors.errors import NotYetAttachedError
from app.manager.sensors.phidgets import Sensor, SensorType

@dataclass
class GreenHouse:
    logger: logging.Logger
    sensor_millidelay: int
    sensors: list[tuple[SensorType, Sensor, float | None]] = field(default_factory=list)
    last_watering: datetime | None = None

    def _actualize_one(
            self,
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
        except PhidgetException as e:
            self.logger.error(f'{stype.value} sent {e}')
        except NotYetAttachedError:
            self.logger.error(f'{stype.value} was not attached with {delay=}')
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
        self.logger.info(self.get())
    
    def water(self) -> str | None:
        """Activates the water pump

        :return: timestamp of last watering
        :rtype: str | None
        """
        self.last_watering = datetime.now()
        # TODO: find a way to start the pump from here
        self.logger.info('water pump activated')
        return self.get_last_watering()

    def get_last_watering(self) -> str | None:
        """Returns the time of the last watering

        :return: timestamp of last watering
        :rtype: str | None
        """
        if not self.last_watering:
            return None
        return self.last_watering.strftime("%H:%M:%S")

    def get(self) -> dict[SensorType, float | None]:
        """Converts the sensor data to human readable format

        :return: human readable values from sensors
        :rtype: dict[SensorType, float | None]
        """

        return {stype.value: val for stype, _, val in self.sensors}
