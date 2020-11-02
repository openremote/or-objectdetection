import os
from flask import Flask
from flask_restful import Api

# import resources
from resources.configuration import Configuration
from resources.feed import VideoFeed

# import database initalizer
from database.init_db import generate_db, close_connection

# generate DB if not done already
generate_db()

# init API
app = Flask(__name__)
api = Api(app)

# add resources
api.add_resource(Configuration, '/')
api.add_resource(VideoFeed, '/feed')


@app.teardown_appcontext
def close_db(exception):
    close_connection(exception)


if __name__ == '__main__':
    app.run(host=os.getenv("BACKEND_HOST", "localhost"), port=os.getenv("BACKEND_PORT", "5050"), debug=True)
