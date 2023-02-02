import os
import secrets
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    WTF_CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'very-secret-key'
    SECURITY_PASSWORD_SALT = secrets.SystemRandom().getrandbits(128)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    POSTS_PER_PAGE = 6
    
    FILES_FOLDER = r'files'
    UPLOAD_FOLDER = r'upload'
    DOWNLOAD_FOLDER = r'download'