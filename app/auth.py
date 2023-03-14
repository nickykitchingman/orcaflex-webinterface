from app.models import User
from app import app, db
from werkzeug.security import check_password_hash

def auth(username, password) -> User:
    user = User.query.filter(
        User.username == username
    ).first()

    if user:
        if check_password_hash(user.password_hash, password):
            return user

    return None

def find(username) -> User:
    return User.query.filter(
        User.username == username
    ).first()

def create(username, password):
    user = User(username, password)
    db.session.add(user)
    db.session.commit()