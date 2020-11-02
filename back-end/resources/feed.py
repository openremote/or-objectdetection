from flask import Flask
from flask_restful import Resource
from database.models.feed import Feed

class VideoFeed(Resource):
    def get(self):
        return Feed.query.all()
