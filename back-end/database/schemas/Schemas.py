from database.models.configuration import Configuration
from database.models.feed import Feed
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema


class ConfigurationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Configuration
        include_relationships = True
        load_instance = True


class FeedSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Feed
        include_relationships = True
        load_instance = True
