from http import HTTPStatus
from flask import Flask, abort, jsonify, request
from flask_restful import Resource
from database.models.configuration import Configuration as Conf
from database.init_db import db_session
from database.schemas.Schemas import ConfigurationSchema

class ConfigurationListAPI(Resource):
    def get(self):
        configs = Conf.query.all()
        config_schema = ConfigurationSchema()
        return config_schema.dump(configs, many=True)

    def post(self):
        json_data = request.get_json(force=True)
        name = json_data['name']
        email = json_data['email']

        config = Conf(name=name, email=email)
        db_session.add(config)
        db_session.commit()

        config_schema = ConfigurationSchema()
        return config_schema.dump(config)


class ConfigurationAPI(Resource):
    def get(self, config_ID):
        if config_ID is None:
            return abort(400, description="missing required parameter")
        else:
            configuration = Conf.query.filter_by(id=config_ID).first()
            if configuration is None:
                abort(404, description=f"Configuration {config_ID} not found")
            else:
                config_schema = ConfigurationSchema()
                return config_schema.dump(configuration)

    def delete(self, config_ID):
        if config_ID is None:
            return abort(400, description="missing required parameter")
        else:
            configuration = Conf.query.filter_by(id=config_ID).first()
            if configuration is None:
                abort(404, description=f"Configuration {config_ID} not found")
            else:
                db_session.delete(configuration)
                db_session.commit()
                return ('', HTTPStatus.NO_CONTENT)

    def put(self, config_ID):
        if config_ID is None:
            return abort(400, description="missing required parameter")
        else:
            configuration = Conf.query.filter_by(id=config_ID).first()
            if configuration is None:
                abort(404, description=f"Configuration {config_ID} not found")
            else:
                json_data = request.get_json(force=True)
                # Update entity based on JSON data
                configuration.name = json_data['name']
                configuration.email  = json_data['email']
                db_session.commit()
                # convert to JSON and return to user
                config_schema = ConfigurationSchema()
                return config_schema.dump(configuration)



