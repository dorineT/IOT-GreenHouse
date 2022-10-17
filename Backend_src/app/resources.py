from flask_restful import Resource

from app import light_sensor

from app.Sensors.Errors import NotYetAttachedError


class LightSensor(Resource):
    def get(self):
        value = -1
        try:
            value = light_sensor.value()
        except NotYetAttachedError:
            pass
        return {'lux': value}
