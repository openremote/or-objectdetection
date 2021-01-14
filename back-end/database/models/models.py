import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from ..init_db import Base


class CamType(enum.IntEnum):
    webcam = 1
    ip_cam = 2
    local_file = 3


class Feed(Base):
    __tablename__ = 'feed'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    location = Column(String(50))
    description = Column(String(120))
    feed_type = Column(Enum(CamType))
    url = Column(String(120))
    active = Column(Boolean)
    configuration = relationship("Configuration", uselist=False, back_populates="feed")

    def __init__(self, name=None, location=None, description=None, feed_type=None, url=None, active=None):
        self.name = name
        self.location = location
        self.description = description
        self.feed_type = feed_type
        self.url = url
        self.active = active

    def __repr__(self):
        return '<Feed %r>' % (self.name)


class DetectionTypes(Base):
    __tablename__ = 'detectiontypes'
    id = Column(Integer, primary_key=True)
    detectionType = Column(String(120), unique=False)
    configuration_id = Column(Integer, ForeignKey('configuration.id'))

    def __init__(self, detectiontype=None):
        self.detectionType = detectiontype

    def __repr__(self):
        return '<DetectionTypes %r>' % (self.detectionType)


class Configuration(Base):
    __tablename__ = 'configuration'
    id = Column(Integer, primary_key=True)
    name = Column(String(60))
    resolution = Column(String(120))
    drawables = Column(Text, unique=False)
    detections = relationship(DetectionTypes)
    feed_id = Column(Integer, ForeignKey('feed.id'), nullable=True)
    feed = relationship("Feed", back_populates="configuration")

    def __init__(self, name=None, resolution=None):
        self.name = name
        self.resolution = resolution

    def __repr__(self):
        return '<Configuration %r>' % (self.feed_id)
