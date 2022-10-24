from flask_restful import Api

from app import app
from app.resources import SensorValues


@app.route('/')
@app.route('/index')
def index() -> str:
    return '<p>Nothing to see here :(</p>'


api = Api(app)
api.add_resource(SensorValues, '/poll')
