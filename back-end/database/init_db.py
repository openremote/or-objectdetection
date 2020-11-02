import sqlite3
import os
from flask import g

#check if we are running in production or development
if "env" in os.environ:
    DATABASE = 'database/db.db'
else:
    DATABASE = 'database/dev-db.db'

def get_db():
    #check if current context already has a database initialized, if not initialize it
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


def close_connection(exception):
    #close the database connection
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def generate_db():
    conn = sqlite3.connect(DATABASE)
    conn.execute('CREATE TABLE IF NOT EXISTS configuration (name TEXT, addr TEXT, city TEXT, pin TEXT)')
    conn.execute('CREATE TABLE IF NOT EXISTS feeds (name TEXT, addr TEXT, city TEXT, pin TEXT)')
    conn.close()
