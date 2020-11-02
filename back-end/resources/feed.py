from flask import Flask
from flask_restful import Resource

class VideoFeed(Resource):
    def get(self):
        return {'hello': 'video feeds'}