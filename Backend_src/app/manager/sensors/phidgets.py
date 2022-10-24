from enum import Enum
from typing import Protocol

from Phidget22.Phidget import Phidget
from Phidget22.Devices.LightSensor import LightSensor
from Phidget22.Devices.TemperatureSensor import TemperatureSensor

from app.manager.sensors.errors import NotYetAttachedError


class SensorType(Enum):
    LIGHT = 'light'
    TEMP = 'temperature'


class Sensor(Protocol):

    _sensor: Phidget

    def __init__(self) -> None:
        ...

    def value(self, max_delay: int) -> float:
        ...


class cLightSensor(Sensor):

    _sensor: LightSensor

    def __init__(self, serial_number: int, port: int) -> None:
        self._sensor = LightSensor()
        self._sensor.setHubPort(port)
        self._sensor.setDeviceSerialNumber(serial_number)

    def value(self, max_delay: int) -> float:
        self._sensor.openWaitForAttachment(max_delay)

        if self._sensor.getAttached():
            value = self._sensor.getIlluminance()
            self._sensor.close()
            return value

        self._sensor.close()
        raise NotYetAttachedError()


class cTempSensor(Sensor):

    _sensor: TemperatureSensor

    def __init__(self, serial_number: int, port: int) -> None:
        self._sensor = TemperatureSensor()
        self._sensor.setHubPort(port)
        self._sensor.setDeviceSerialNumber(serial_number)

    def value(self, max_delay: int) -> float:
        self._sensor.openWaitForAttachment(max_delay)

        if self._sensor.getAttached():
            value = self._sensor.getTemperature()
            self._sensor.close()
            return value

        self._sensor.close()
        raise NotYetAttachedError()
