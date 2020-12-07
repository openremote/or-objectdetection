from http import HTTPStatus
from flask import Flask, abort, jsonify, request
from flask_restful import Resource
from database.models.models import Configuration as Conf, Feed, DetectionTypes
from database.init_db import db_session
from database.schemas.Schemas import ConfigurationSchema


class ConfigurationListAPI(Resource):
    def get(self):
        configs = Conf.query.all()
        config_schema = ConfigurationSchema()
        return config_schema.dump(configs, many=True)

    def post(self):
        json_data = request.get_json(force=True)
        feed_id = json_data['feed_id']
        name = json_data['name']
        resolution = json_data['resolution']
        # Fetch detection_types if they exist
        if 'detection_types' in json_data:
            detectiontypes = json_data['detection_types']
        else:
            detectiontypes = None

        # Fetch drawables if they exist
        if 'drawables' in json_data:
            drawables = json_data['drawables']
        else:
            drawables = None

        # get a scoped DB session
        scoped_session = db_session()

        # create config and link it to the Feed
        config = Conf(name=name, resolution=resolution)
        feed = Feed.query.get(feed_id)
        feed.configuration = config

        # Create drawables object if it was passed and add them to the configuration
        if drawables is not None:
            config.drawables = drawables

        # create detectiontypes object for each within detectiontypes array and add them to the configuration
        # relationship
        if detectiontypes is not None:
            for item in detectiontypes:
                dt = DetectionTypes(detectionType=item)
                config.detections.append(dt)

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
                detectiontypes = json_data['detection_types']

                # Wipe detection types and re set them based on the given detectiontypes
                configuration.detections.clear()
                for item in detectiontypes:
                    dt = DetectionTypes(detectionType=item)
                    config.detections.append(dt)

                configuration.name = json_data['name']
                configuration.resolution = json_data['resolution']
                configuration.drawables = json_data['drawables']

                scoped_session.commit()
                # convert to JSON and return to user
                config_schema = ConfigurationSchema()
                return config_schema.dump(configuration)
