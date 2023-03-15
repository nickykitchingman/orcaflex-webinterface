from app import app
from app.orcaflex import filing, api
from flask import request, render_template, send_file, Response, jsonify, abort
from flask_restful import Resource
from app.auth import auth, find, create
from marshmallow import Schema, fields

class UidSchema(Schema):
    uid = fields.Int(required=True)
    
uid_schema_instance = UidSchema()

def check_uid(func):
    def wrapper(self):
        errors = uid_schema_instance.validate(request.args)
        
        if errors:
            abort(400, str(errors))
            
        return func(self)
            
    return wrapper

class FileSubmission(Resource):

    @check_uid
    def post(self):
        uid = int(request.args['uid'])
        
        files = request.files.getlist('files')
        filing.save_files(files, uid)
        
class JobList(Resource):
    
    @check_uid
    def get(self):
        uid = int(request.args['uid'])
        
        jobs = filing.get_all_jobs_json(uid)

        return Response(jobs, mimetype='application/json')

    @check_uid
    def post(self):
        content = request.json
        ids = list(map(int, content['jobs']))
        jobs = filing.get_jobs(ids)
        dicts = [job.get_dict() for job in jobs]
        return jsonify({'jobs': dicts})

class ProcessJob(Resource):
       
    @check_uid
    def post(self):
        errors = uid_schema_instance.validate(request.args)
        
        if errors:
            abort(400, str(errors))
        
        content = request.json
        job = content['job']
        sim = api.process_job(job)

        if sim:
            return jsonify({'job': sim.get_dict()})

class ProcessJobs(Resource):
    
    @check_uid
    def post(self):
        content = request.json
        jobs = content['jobs']
        sims = api.process_jobs(jobs)
        dicts = [sim.get_dict() for sim in sims]
        return jsonify({'jobs': dicts})

class DownloadJob(Resource):
    
    @check_uid
    def post(self):
        content = request.json
        job_id = content['job']
        path, filename = filing.get_sim_path(job_id)
        
        if path is not None:
            return send_file(path, as_attachment=True, download_name=filename)

class ClearJobs(Resource):
    
    @check_uid
    def get(self):
        filing.clear_jobs()

class PauseJobs(Resource):
    
    @check_uid
    def post(self):
        content = request.json
        jobs = content['jobs']
        api.pause_jobs(jobs)
    
class StopJobs(Resource):
    
    @check_uid
    def post(self):
        content = request.json
        job_ids = content['jobs']
        api.stop_jobs(job_ids)

class Login(Resource):
    def post(self):
        content = request.json
        username = content['username']
        password = content['password']
        authenticated_user = auth(username, password)

        if authenticated_user:
            return jsonify({ 'uid': authenticated_user.uid })

        return Response(status = 401)

class Signout(Resource):

    @check_uid
    def post(self):
        return Response(status = 200)

class Signup(Resource):
    def post(self):
        content = request.json

        username = content['username']
        password = content['password']

        if find(username):
            return Response(status = 418)

        create(username, password)
        return Response(status = 200)
        