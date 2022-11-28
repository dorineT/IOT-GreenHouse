import logging

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import datetime
from threading import Thread

from Phidget22.PhidgetException import PhidgetException

from app.manager.sensors.errors import NotYetAttachedError
from app.manager.sensors.phidgets import Sensor, SensorType
from app.manager.sensors.digital_output import cDOutput
from app.manager.sensors.lcd import cLCD
from app.manager.sensors.lcd import MUST_CLOSE_CMD, MUST_OPEN_CMD, MUST_WATER_CMD
from app.manager.sensors.lcd import EVERYTHING_OK_CMD, SENSOR_MISSING_CMD, MUST_MOVE_CMD


@dataclass
class GreenHouse:
    logger: logging.Logger
    sensor_millidelay: int
    lcd_screen: cLCD
    digital_output: cDOutput
    sensors: list[tuple[SensorType, Sensor, float | None]
                  ] = field(default_factory=list)
    last_watering: datetime | None = None

    def start_lcd(self):
        self.lcd_screen.start()

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

        self.sensors = [
            (stype, sensor, nvalue) for (
                stype, sensor, _), nvalue in zip(
                self.sensors, values)]
        self.logger.info(self.get())

    def display(self, message: str) -> None:
        """Displays a message on the LCD

        :param message: message to display
        :type message: str
        """
        if not self.lcd_screen.is_alive():
            self.logger.warning(
                f'sending {message=} to LCD screen but it is unreachable')
            return

        self.logger.info(f'sending {message=} to LCD screen')
        self.lcd_screen.queue.put(message)

    def water(self) -> str | None:
        """Activates the water pump

        :return: timestamp of last watering
        :rtype: str | None
        """
        now = datetime.now()
        timeout = 5000
        duration = 30

        # Let the previous watering finish, if any
        if self.last_watering and now.timestamp() - self.last_watering.timestamp() < 1.5 * \
                (timeout / 1000 + duration):
            return self.get_last_watering()

        self.last_watering = now
        Thread(target=self.digital_output.action,
               args=(timeout, duration)).start()
        return self.get_last_watering()

    def get_last_watering(self) -> int | None:
        """Returns the time of the last watering

        :return: timestamp of last watering
        :rtype: int | None
        """
        if not self.last_watering:
            return None
        return int(self.last_watering.timestamp())

    def get(self) -> dict[SensorType, float | None]:
        """Converts the sensor data to human readable format

        :return: human readable values from sensors
        :rtype: dict[SensorType, float | None]
        """

        return {stype.value: val for stype, _, val in self.sensors}

    def current_state(self) -> str:
        """Computes the current state of the green house.
        Returns the message to display to the user

        :return: current state of the green house
        :rtype: str
        """
        vals = self.get()

        light = vals.get(SensorType.LIGHT.value)
        co2 = vals.get(SensorType.CO2.value)
        hum = vals.get(SensorType.HUM.value)
        temp = vals.get(SensorType.TEMP.value)

        # Checking for None
        if co2 is None or hum is None or temp is None or light is None:
            return SENSOR_MISSING_CMD

        # Move the green house?
        # Reasons:
        # - Light too low (in lux) during the day
        if 8 <= datetime.now().hour <= 20 and light < 1_000:
            return MUST_MOVE_CMD

        # Open the green house?
        # Reasons:
        # - Temperature too high (in °C)
        # - Humidity too high (in %)
        # - CO2 concentration too high (in ppm)
        if temp > 32 or hum > 75 or co2 > 1200:
            return MUST_OPEN_CMD

        # Close the green house?
        # Reasons:
        # - Temperature too low
        # - CO2 concentration too low
        if temp < 16 or co2 < 300:
            return MUST_CLOSE_CMD

        # Water the green house?
        # Reasons:
        # - Humidity too low
        if hum < 40:
            return MUST_WATER_CMD

        return EVERYTHING_OK_CMD
