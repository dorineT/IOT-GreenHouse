from queue import Queue

from flask import Flask

from app.loggers import green_house_logger, request_logger
from app.manager.GreenHouse import GreenHouse
from app.manager.GreenHouseManager import GreenHouseManager
from app.manager.sensors.phidgets import SensorType
from app.manager.sensors.phidgets import cTempSensor, cLightSensor, cHumSensor, cCO2Sensor, cPHSensor
from app.manager.sensors.lcd import cLCD

app = Flask(__name__)

# Green house
phub_serial_number = 672154

gh_logger = green_house_logger()
green_house = GreenHouse(
    logger=gh_logger,
    sensor_millidelay=5000,
    lcd_screen=cLCD(
        logger=gh_logger,
        queue=Queue(),
        serial_number=phub_serial_number,
        port=5,
        timeout=5000),
    sensors=[
        (SensorType.LIGHT, cLightSensor(serial_number=phub_serial_number, port=0), None),
        (SensorType.HUM, cHumSensor(serial_number=phub_serial_number, port=1), None),
        (SensorType.TEMP, cTempSensor(serial_number=phub_serial_number, port=2), None),
        (SensorType.CO2, cCO2Sensor(serial_number=phub_serial_number, port=3), None),
        (SensorType.PH, cPHSensor(serial_number=phub_serial_number, port=4), None),
    ])

# Gree house manager
green_house_manager = GreenHouseManager(green_house, poll_mindelay=1)
green_house_manager.start()
green_house_manager.green_house.start_lcd()

# Request
requests_logger = request_logger()

from app import routes
