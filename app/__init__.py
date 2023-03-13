from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, expose_headers=["Content-Disposition"])

api = Api(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import models, routes, auth

app.register_blueprint(auth.bp)

api.add_resource(routes.FileSubmission, '/files')
api.add_resource(routes.JobList, '/jobs')
api.add_resource(routes.ProcessJob, '/processjob')
api.add_resource(routes.ProcessJobs, '/processjobs')
api.add_resource(routes.DownloadJob, '/downloadjob')
api.add_resource(routes.ClearJobs, '/clearjobs')
api.add_resource(routes.PauseJobs, '/pausejobs')
api.add_resource(routes.StopJobs, '/stopjobs')