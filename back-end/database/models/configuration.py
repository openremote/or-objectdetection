from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..init_db import Base


class Configuration(Base):
    __tablename__ = 'configuration'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=False)
    email = Column(String(120), unique=False)
    feed_id = Column(Integer, ForeignKey('feed.id'), nullable=True)
    feed = relationship("Feed", back_populates="configuration")

    def __init__(self, name=None, email=None):
        self.name = name
        self.email = email

    def __repr__(self):
        return '<Configuration %r>' % (self.name)
