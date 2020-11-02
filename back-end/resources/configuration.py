from flask import Flask
from flask_restful import Resource

class Configuration(Resource):
    def get(self):
        return {'hello': 'configuration'}