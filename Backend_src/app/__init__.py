from flask import Flask

from app.manager.GreenHouse import GreenHouse
from app.manager.GreenHouseManager import GreenHouseManager
from app.manager.sensors.phidgets import SensorType, cTempSensor, cLightSensor

app = Flask(__name__)
green_house = GreenHouse(
    sensor_millidelay=5000,
    sensors=[
        (SensorType.LIGHT, cLightSensor(serial_number=672154, port=0), None),
        (SensorType.TEMP, cTempSensor(serial_number=672154, port=2), None),
    ])
green_house_manager = GreenHouseManager(green_house, poll_mindelay=1)
green_house_manager.daemon = True
green_house_manager.start()

from app import routes
