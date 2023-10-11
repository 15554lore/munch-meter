from backend import db
from dataclasses import dataclass


@dataclass
class Image(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    image_url: str = db.Column(db.String(50))
    score: int = db.Column(db.Integer)
    total_comparisons: int = db.Column(db.Integer)
    image_title: str = db.Column(db.String(50))
    author_id: int = db.Column(db.Integer)


@dataclass
class Users(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    username: str = db.Column(db.String(50))
    password_hash: str = db.Column(db.String(60))
    email: str = db.Column(db.String(254))
    salt_num: int = db.Column(db.Integer)
    confirmed: int = db.Column(db.Integer, default=0)
    confirmed_on: str = db.Column(db.String(20))
