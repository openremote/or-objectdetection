from flask import Flask
from flask_restful import Resource
from database.models.configuration import Configuration as Conf

class Configuration(Resource):
    def get(self):
        return Conf.query.all()
