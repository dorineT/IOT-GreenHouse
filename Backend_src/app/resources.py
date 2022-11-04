from flask_restful import Resource

from app import green_house_manager


class SensorValues(Resource):
    def get(self):
        summary = green_house_manager.summary()
        return summary, 200

class Water(Resource):
    def post(self):
        green_house_manager.water()
        return None, 204
