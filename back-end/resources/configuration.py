from flask import Flask, abort
from flask_restful import Resource
from database.models.configuration import Configuration as Conf


class ConfigurationListAPI(Resource):
    def get(self):
        return Conf.query.all()


class ConfigurationAPI(Resource):
    def get(self, config_ID):
        if config_ID is None:
            return abort(400, description="missing required parameter")
        else:
            configuration = Conf.query.filter_by(id=config_ID).first()
            if configuration is None:
                abort(404, description=f"Configuration {config_ID} not found")
            else:
                return configuration
