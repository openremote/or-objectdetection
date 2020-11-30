from http import HTTPStatus
from flask import Flask, abort, jsonify, request
from flask_restful import Resource
from database.models.configuration import Configuration as Conf
from database.models.feed import Feed
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
        feed_id = json_data['feed_id']

        # get a scoped DB session
        scoped_session = db_session()

        # create config and link it to the Feed
        config = Conf(name=name, email=email)
        feed = Feed.query.get(feed_id)
        feed.configuration = config

        # commit the changes
        scoped_session.commit()

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
            # get a scoped DB session
            scoped_session = db_session()

            configuration = Conf.query.filter_by(id=config_ID).first()
            if configuration is None:
                abort(404, description=f"Configuration {config_ID} not found")
            else:
                scoped_session.delete(configuration)
                scoped_session.commit()
                return ('', HTTPStatus.NO_CONTENT)

    def put(self, config_ID):
        if config_ID is None:
            return abort(400, description="missing required parameter")
        else:
            # get a scoped DB session
            scoped_session = db_session()

            configuration = Conf.query.filter_by(id=config_ID).first()
            if configuration is None:
                abort(404, description=f"Configuration {config_ID} not found")
            else:
                # Update entity based on JSON data
                json_data = request.get_json(force=True)
                configuration.name = json_data['name']
                configuration.email = json_data['email']

                scoped_session.commit()
                # convert to JSON and return to user
                config_schema = ConfigurationSchema()
                return config_schema.dump(configuration)
