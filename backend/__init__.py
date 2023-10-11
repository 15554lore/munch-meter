from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail

from .config import BaseConfig
# running this file will reset the database

db = SQLAlchemy()
app = Flask(__name__)

app.config.from_object(BaseConfig())

mail = Mail(app)

db.init_app(app)
app.app_context().push()

from backend import routes
from backend.models import *


with app.app_context():
     # db.drop_all()
     db.create_all()

def reset_database():
     with app.app_context():
          db.drop_all()
          db.create_all()