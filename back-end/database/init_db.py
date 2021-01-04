import sqlite3
import os
from flask import g
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from flask import current_app

# first check if we are running tests or not
if 'SQLALCHEMY_URL' not in os.environ:
    # check if we are running in production or development
    if "env" in os.environ:
        os.environ['SQLALCHEMY_URL'] = 'sqlite:///database/db.db'
    else:
        os.environ['SQLALCHEMY_URL'] = 'sqlite:///database/dev-db.db'

engine = create_engine(os.environ['SQLALCHEMY_URL'], convert_unicode=True)
session_factory = sessionmaker(autocommit=False,
                               autoflush=False,
                               bind=engine)
db_session = scoped_session(session_factory)
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import database.models
    Base.metadata.create_all(bind=engine)