from database.models.configuration import Configuration
from database.models.feed import Feed
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_enum import EnumField
from database.models.feed import CamType


class ConfigurationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Configuration
        include_relationships = True
        load_instance = True


class FeedSchema(SQLAlchemyAutoSchema):
    feed_type = EnumField(CamType, by_value=True)

    class Meta:
        model = Feed
        include_relationships = True
        load_instance = True
