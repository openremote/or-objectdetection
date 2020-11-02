import os
from flask import Flask
from flask_restful import Api

# import resources
from resources.configuration import Configuration
from resources.feed import VideoFeed

# import database
from database.init_db import db_session, init_db

# init Database
init_db()

# init API
app = Flask(__name__)
api = Api(app)

# add resources
api.add_resource(Configuration, '/')
api.add_resource(VideoFeed, '/feed')


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == '__main__':
    app.run(host=os.getenv("BACKEND_HOST", "localhost"), port=os.getenv("BACKEND_PORT", "5050"), debug=True)
