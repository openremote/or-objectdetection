import os
import eventlet
#patch python threading to green threads from eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_restful import Api
from flask_socketio import SocketIO

# import resources
from resources.configuration import ConfigurationAPI, ConfigurationListAPI
from resources.feed import VideoFeedAPI, VideoFeedListAPI

# import rabbitMQ consumer worker initializer
from workers.init_worker import startConsumingWorker

# import database
from database.init_db import db_session, init_db

# init Database
init_db()

# init API
app = Flask(__name__)
api = Api(app)
socketio = SocketIO(app, logger=True, engineio_logger=True, async_mode='eventlet', cors_allowed_origins="*")

# add resources
api.add_resource(ConfigurationListAPI, '/configurations', endpoint='tasks')
api.add_resource(ConfigurationAPI, '/configurations/<int:config_ID>', endpoint='task')
api.add_resource(VideoFeedListAPI, '/feeds', endpoint='feeds')
api.add_resource(VideoFeedAPI, '/feeds/<int:feed_ID>', endpoint='feed')


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


# probably switch to flask-script for non POC implementation, this one is not fired until we receive a first request
@app.before_first_request
def _run_on_start():
    startConsumingWorker()


if __name__ == '__main__':
    socketio.run(app, port=os.getenv("BACKEND_PORT", "5050"), host=os.getenv("BACKEND_HOST", "localhost"))

