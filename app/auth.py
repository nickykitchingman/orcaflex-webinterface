from flask_login import LoginManager
from app.models import User
from app import app
from werkzeug.security import check_password_hash

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(uid):
    return User.get(uid)

def auth(username, password) -> User:
    user = User.query.filter(
        User.username == username
    ).first()

    if user:
        if check_password_hash(user.password_hash, password):
            user.authenticated = True
            return user

    return None
