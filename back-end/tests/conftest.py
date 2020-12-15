# Third party modules
import pytest
import os
# set the sqlalchemy url to a in memory database before we import the init (and thus the init_db function).
os.environ['SQLALCHEMY_URL'] = 'sqlite://'
# Import the create app function from init.py
from init import create_app

@pytest.fixture
def client():
    app = create_app()
    app.testing = True

    with app.test_client() as client:
        yield client