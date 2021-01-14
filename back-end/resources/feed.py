# standard python import
from http import HTTPStatus
# flask imports
from flask import abort, request
from flask_restful import Resource
from database.models.models import Feed
from database.init_db import db_session
from database.schemas.Schemas import FeedSchema, DetectionTypesSchema
# rabbitMQ
from rabbitmq.rabbitMQ import rabbit_url, feed_queue
from kombu import Connection
import json

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


class VideoFeedStreamAPI(Resource):
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
                with Connection(rabbit_url, heartbeat=4) as conn:
                    # flip boolean
                    feed.active = not feed.active
                    # fetch schema for dumping database model class to json
                    dt_schema = DetectionTypesSchema()
                    # Produce a message to RabbitMQ so detection manager can consume and start the approriate feed
                    # with the given data.
                    producer = conn.Producer(serializer='json')

                    detections = None if feed.configuration is None else feed.configuration.detections
                    drawables = None if feed.configuration is None else feed.configuration.drawables

                    producer.publish(
                        {'id': feed.id, 'feed_type': json.dumps(feed.feed_type), 'url': feed.url, 'active': feed.active, 'detections': dt_schema.dump(detections, many=True), 'drawables': drawables},
                        retry=True,
                        expiration=10,
                        exchange=feed_queue.exchange,
                        routing_key=feed_queue.routing_key,
                        declare=[feed_queue],  # declares exchange, queue and binds.
                    )

                    scoped_session.commit()

                    conn.release()

                # convert to JSON and return to user
                feed_schema = FeedSchema()
                return feed_schema.dump(feed)
