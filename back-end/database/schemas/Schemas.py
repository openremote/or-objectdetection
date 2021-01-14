from database.models.models import Configuration, Feed, DetectionTypes, CamType
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, fields
from marshmallow_enum import EnumField


class DetectionTypesSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = DetectionTypes
        include_relationships = True
        load_instance = True


class ConfigurationSchema(SQLAlchemyAutoSchema):
    detections = fields.Nested(DetectionTypesSchema, many=True)

    class Meta:
        model = Configuration
        include_relationships = True
        load_instance = True


class FeedSchema(SQLAlchemyAutoSchema):
    feed_type = EnumField(CamType, by_value=True)
    configuration = fields.Nested(ConfigurationSchema)

    class Meta:
        model = Feed
        include_relationships = True
        load_instance = True

