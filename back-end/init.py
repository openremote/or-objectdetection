import os
import eventlet
#patch python threading to green threads from eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from workers.init_worker import startMQTTWorker

# import resources
from resources.configuration import ConfigurationAPI, ConfigurationListAPI
from resources.feed import VideoFeedAPI, VideoFeedListAPI, VideoFeedStreamAPI

# import database
from database.init_db import db_session, init_db


def create_app():
    # init API
    app = Flask(__name__)
    app.config['CORS_HEADERS'] = 'Content-Type'
    api = Api(app)

    cors = CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    startMQTTWorker()

    # init Database
    init_db()

    # add resources
    api.add_resource(ConfigurationListAPI, '/configurations',   endpoint='configs')
    api.add_resource(ConfigurationAPI, '/configurations/<int:config_ID>', endpoint='config')
    api.add_resource(VideoFeedListAPI, '/feeds', endpoint='feeds')
    api.add_resource(VideoFeedAPI, '/feeds/<int:feed_ID>', endpoint='feed')
    api.add_resource(VideoFeedStreamAPI, '/feeds/start/<int:feed_ID>', endpoint='start_feed')

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host=os.getenv("BACKEND_HOST", "localhost"), port=os.getenv("BACKEND_PORT", "5050"), debug=True)

