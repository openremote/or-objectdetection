from sqlalchemy import Column, Integer, String
from ..init_db import Base


class Feed(Base):
    __tablename__ = 'feeds'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    location = Column(String(50), unique=False)
    description = Column(String(120), unique=False)

    def __init__(self, name=None, location=None, description=None):
        self.name = name
        self.location = location
        self.description = description

    def __repr__(self):
        return '<Feed %r>' % (self.name)