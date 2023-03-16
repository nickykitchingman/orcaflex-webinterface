import os
import secrets
from datetime import timedelta
import multiprocessing

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    MAXIMUM_ACTIVE_WORKERS = os.environ.get('MAXIMUM_ACTIVE_WORKERS') or multiprocessing.cpu_count()
    WORKER_UPDATE_INTERVAL = 2 # in seconds
    
    WTF_CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_urlsafe(16)
    SECURITY_PASSWORD_SALT = secrets.SystemRandom().getrandbits(128)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': MAXIMUM_ACTIVE_WORKERS
    }

    POSTS_PER_PAGE = 6
    
    FILES_FOLDER = r'files'
    UPLOAD_FOLDER = r'upload'
    DOWNLOAD_FOLDER = r'download'
    PAUSED_FOLDER = r'paused'
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or secrets.token_urlsafe(64)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
