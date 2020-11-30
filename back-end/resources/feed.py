from http import HTTPStatus
from flask import abort, request
from flask_restful import Resource
from database.models.feed import Feed
from database.init_db import db_session
from database.schemas.Schemas import FeedSchema


class VideoFeedListAPI(Resource):
    def get(self):
        feeds = Feed.query.all()
        feed_schema = FeedSchema()
        return feed_schema.dump(feeds, many=True)

    def post(self):
        json_data = request.get_json(force=True)
        name = json_data['name']
        description = json_data['description']
        location = json_data['location']
        feed_type = json_data['feed_type']
        url = json_data['url']

        # get a scoped DB session
        scoped_session = db_session()

        # feed can not be created and instantly go active, it needs to be configured first.
        feed = Feed(name=name, location=location, description=description, feed_type=feed_type, url=url, active=False)
        scoped_session.add(feed)
        scoped_session.commit()

        feed_schema = FeedSchema()
        return feed_schema.dump(feed)


class VideoFeedAPI(Resource):
    def get(self, feed_ID):
        if feed_ID is None:
            return abort(400, description="missing required parameter")
        else:
            feed = Feed.query.filter_by(id=feed_ID).first()
            if feed is None:
                abort(404, description=f"Feed {feed_ID} not found")
            else:
                feed_schema = FeedSchema()
                return feed_schema.dump(feed)

    def delete(self, feed_ID):
        if feed_ID is None:
            return abort(400, description="missing required parameter")
        else:
            # get a scoped DB session
            scoped_session = db_session()

            feed = Feed.query.filter_by(id=feed_ID).first()
            if feed is None:
                abort(404, description=f"Feed {feed_ID} not found")
            else:
                scoped_session.delete(feed)
                scoped_session.commit()
                return '', HTTPStatus.NO_CONTENT

    def put(self, feed_ID):
        if feed_ID is None:
            return abort(400, description="missing required parameter")
        else:
            # get a scoped DB session
            scoped_session = db_session()

            feed = Feed.query.filter_by(id=feed_ID).first()
            if feed is None:
                abort(404, description=f"Feed {feed_ID} not found")
            else:
                # Update entity based on JSON data
                json_data = request.get_json(force=True)
                feed.name = json_data['name']
                feed.description = json_data['description']
                feed.location = json_data['location']
                feed.feed_type = json_data['feed_type']
                feed.url = json_data['url']

                scoped_session.commit()
                # convert to JSON and return to user
                feed_schema = FeedSchema()
                return feed_schema.dump(feed)
