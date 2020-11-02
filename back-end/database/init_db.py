import sqlite3
import os
from flask import g
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

#check if we are running in production or development
if "env" in os.environ:
    DATABASE = 'database/db.db'
else:
    DATABASE = 'database/dev-db.db'

engine = create_engine(f'sqlite:///{DATABASE}', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import database.models
    Base.metadata.create_all(bind=engine)

