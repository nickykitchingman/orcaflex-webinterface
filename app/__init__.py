from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, expose_headers=["Content-Disposition"])
api = Api(app)

from app import models, routes, auth, errors

app.register_blueprint(auth.bp)
app.add_url_rule('/', endpoint='index')

api.add_resource(routes.FileSubmission, '/files')