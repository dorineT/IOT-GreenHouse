from flask_restful import Resource

from app import green_house_manager, requests_logger


class SensorValues(Resource):
    def get(self):
        summary = green_house_manager.summary()
        requests_logger.info(f'Polling sensors: {summary=}')
        return summary, 200

class Water(Resource):
    def post(self):
        recent_watering = green_house_manager.activate_watering()
        requests_logger.info(f'Activating water pump: {recent_watering=}')
        return {'last_watering': recent_watering}, 201

    def get(self):
        last_watering = green_house_manager.last_watering()
        requests_logger.info(f'Polling watering: {last_watering=}')
        return {'last_watering': last_watering}, 200
