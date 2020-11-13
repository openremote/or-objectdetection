from flask import Flask, abort, Response
from flask_restful import Resource
from database.models.feed import Feed


class VideoFeedListAPI(Resource):
    def get(self):
        return Feed.query.all()


class VideoFeedAPI(Resource):
    def get(self, feed_ID):
        if feed_ID is None:
            return abort(400, description="missing required parameter")
        else:
            configuration = Feed.query.filter_by(id=feed_ID).first()
            if configuration is None:
                abort(404, description=f"Feed {feed_ID} not found")
            else:
                return configuration
