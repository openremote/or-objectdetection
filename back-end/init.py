import os
import eventlet
#patch python threading to green threads from eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_restful import Api

# import resources
from resources.configuration import ConfigurationAPI, ConfigurationListAPI
from resources.feed import VideoFeedAPI, VideoFeedListAPI

# import database
from database.init_db import db_session, init_db

# init Database
init_db()

# init API
app = Flask(__name__)
api = Api(app)

# add resources
api.add_resource(ConfigurationListAPI, '/configurations', endpoint='tasks')
api.add_resource(ConfigurationAPI, '/configurations/<int:config_ID>', endpoint='task')
api.add_resource(VideoFeedListAPI, '/feeds', endpoint='feeds')
api.add_resource(VideoFeedAPI, '/feeds/<int:feed_ID>', endpoint='feed')


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == '__main__':
    app.run(host=os.getenv("BACKEND_HOST", "localhost"), port=os.getenv("BACKEND_PORT", "5050"), debug=True)

