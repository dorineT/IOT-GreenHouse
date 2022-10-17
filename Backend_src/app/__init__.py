from flask import Flask

from app.Sensors.LightSensor import tLightSensor

app = Flask(__name__)
light_sensor = tLightSensor()
light_sensor.start()

from app import routes
