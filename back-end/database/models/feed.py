import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum
from ..init_db import Base


class CamType(enum.Enum):
    webcam = 1
    ip_cam = 2
    local_file = 3


class Feed(Base):
    __tablename__ = 'feeds'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    location = Column(String(50))
    description = Column(String(120))
    feed_type = Column(Enum(CamType))
    url = Column(String(120))
    active = Column(Boolean)

    def __init__(self, name=None, location=None, description=None, feed_type=None, url=None, active=None):
        self.name = name
        self.location = location
        self.description = description
        self.feed_type = feed_type
        self.url = url
        self.active = active

    def __repr__(self):
        return '<Feed %r>' % (self.name)
