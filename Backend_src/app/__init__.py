from flask import Flask

from app.manager.GreenHouseManager import GreenHouseManager

app = Flask(__name__)
green_house_manager = GreenHouseManager(poll_secdelay=5, sensor_millidelay=5000)
green_house_manager.start()

from app import routes
