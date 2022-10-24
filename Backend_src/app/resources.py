from flask_restful import Resource

from app import green_house_manager


class SensorValues(Resource):
    def get(self):
        v = green_house_manager.summary()
        return v, 200
