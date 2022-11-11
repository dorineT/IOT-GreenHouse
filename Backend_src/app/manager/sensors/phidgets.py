from enum import Enum
from typing import Callable

from perlin_noise import PerlinNoise

from Phidget22.Phidget import Phidget
from Phidget22.Devices.LightSensor import LightSensor
from Phidget22.Devices.TemperatureSensor import TemperatureSensor
from Phidget22.Devices.HumiditySensor import HumiditySensor

from app.manager.sensors.errors import NotYetAttachedError


class SensorType(Enum):
    LIGHT = 'light'
    TEMP = 'temperature'
    HUM = 'humidity'
    CO2 = 'co2'
    PH = 'ph'


class Sensor:

    def __init__(self, sensor: Phidget, serial_number: int, port: int) -> None:
        self._sensor = sensor
        self._sensor.setHubPort(port)
        self._sensor.setDeviceSerialNumber(serial_number)

    def _reach(self, f: Callable[[], float], max_delay: int) -> float:
        """Opens the connection with the sensor, retrieves the value
        and closes the connection afterwards

        :param f: method to retrieve value
        :type f: Callable[[], float]
        :param max_delay: max wait time until error
        :type max_delay: int
        :raises NotYetAttachedError: when the sensor didn't have enough time to get connected.
                Maybe retry with higher `max_delay`
        :return: sensor value. None if an error occured
        :rtype: float
        """
        self._sensor.openWaitForAttachment(max_delay)

        if self._sensor.getAttached():
            value = f()
            self._sensor.close()
            return value

        self._sensor.close()
        raise NotYetAttachedError()

    def value(self, max_delay: int) -> float:
        """Retrives the value from the sensor.

        :param max_delay: max wait time until error
        :type max_delay: int
        :raises NotImplementedError: this method should be overriden
        :return: sensor value
        :rtype: float
        """
        raise NotImplementedError


class cLightSensor(Sensor):

    _sensor: LightSensor

    def __init__(self, serial_number: int, port: int) -> None:
        super().__init__(LightSensor(), serial_number, port)

    def value(self, max_delay: int) -> float:
        return self._reach(self._sensor.getIlluminance, max_delay)


class cTempSensor(Sensor):

    _sensor: TemperatureSensor

    def __init__(self, serial_number: int, port: int) -> None:
        super().__init__(TemperatureSensor(), serial_number, port)

    def value(self, max_delay: int) -> float:
        return self._reach(self._sensor.getTemperature, max_delay)

class cHumSensor(Sensor):

    _sensor: HumiditySensor

    def __init__(self, serial_number: int, port: int) -> None:
        super().__init__(HumiditySensor(), serial_number, port)

    def value(self, max_delay: int) -> float:
        return self._reach(self._sensor.getHumidity, max_delay)

class cCO2Sensor(Sensor):
    
    def __init__(self, serial_number: int, port: int) -> None:
        noise = PerlinNoise(octaves=10, seed=1)
        self.mean = 650
        self.noise_map = [self.mean + self.mean*noise(i/100) for i in range(100)]
        self.cidx = -1
        self.cdir = 1
        
    def value(self, max_delay: int) -> float:
        
        if self.cidx == len(self.noise_map):
            self.cdir = -1
        elif self.cidx == -1:
            self.cdir = 1
        
        self.cidx += self.cdir
        return self.noise_map[self.cidx]
        
class cPHSensor(Sensor):
    
    def __init__(self, serial_number: int, port: int) -> None:
        noise = PerlinNoise(octaves=10, seed=2)
        self.mean = 7
        self.noise_map = [self.mean + self.mean*0.2*noise(i/100) for i in range(100)]
        self.cidx = -1
        self.cdir = 1
        
    def value(self, max_delay: int) -> float:
        
        if self.cidx == len(self.noise_map):
            self.cdir = -1
        elif self.cidx == -1:
            self.cdir = 1
        
        self.cidx += self.cdir
        return self.noise_map[self.cidx]
 