from sqlalchemy import Column, Integer, String
from ..init_db import Base


class Configuration(Base):
    __tablename__ = 'configurations'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    email = Column(String(120), unique=True)

    def __init__(self, name=None, email=None):
        self.name = name
        self.email = email

    def __repr__(self):
        return '<Configuration %r>' % (self.name)
