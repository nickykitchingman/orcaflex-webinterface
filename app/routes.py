from app import app
from app.orcaflex import filing, api
from flask import request, render_template, send_file, Response, jsonify, abort
from flask_restful import Resource
from app.auth import auth, find, create
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager, set_access_cookies
from datetime import datetime, timezone, timedelta
import json

jwt_manager = JWTManager(app)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()['exp']
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity(), fresh=True)
            data = response.get_json()
            
            if type(data) is dict:
                data['token'] = access_token
                response.data = json.dumps(data)
            elif data is None:
                response.data = json.dumps({ 
                    'token': access_token
                })

        return response
        
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response

class FileSubmission(Resource):

    @jwt_required()
    def post(self):
        files = request.files.getlist('files')
        filing.save_files(files, get_jwt_identity())
        
class JobList(Resource):
    
    @jwt_required()
    def get(self):
        uid = get_jwt_identity()
        jobs = filing.get_all_jobs_json(uid)

        return Response(jobs, mimetype='application/json')

    @jwt_required()
    def post(self):
        content = request.json
        ids = list(map(int, content['jobs']))
        jobs = filing.get_jobs(ids)
        dicts = [job.get_dict() for job in jobs]
        return jsonify({'jobs': dicts})

class ProcessJob(Resource):
       
    @jwt_required()
    def post(self):
        content = request.json
        job = content['job']
        sim = api.process_job(job)

        if sim:
            return jsonify({'job': sim.get_dict()})

class ProcessJobs(Resource):
    
    @jwt_required()
    def post(self):
        content = request.json
        jobs = content['jobs']
        sims = api.process_jobs(jobs)
        dicts = [sim.get_dict() for sim in sims]
        return jsonify({'jobs': dicts})

class DownloadJob(Resource):
    
    @jwt_required()
    def post(self):
        content = request.json
        job_id = content['job']
        path, filename = filing.get_sim_path(job_id)
        
        if path is not None:
            return send_file(path, as_attachment=True, download_name=filename)

class ClearJobs(Resource):
    
    @jwt_required()
    def post(self):
        content = request.json
        jobs = content['jobs']
        
        uid = get_jwt_identity()
        filing.clear_jobs(uid, jobs)

class PauseJobs(Resource):
    
    @jwt_required()
    def post(self):
        content = request.json
        jobs = content['jobs']
        api.pause_jobs(jobs)

class StopJobs(Resource):
    
    @jwt_required()
    def post(self):
        content = request.json
        job_ids = content['jobs']
        api.stop_jobs(job_ids)

class Login(Resource):
    def post(self):
        """
        Logs the user in, must have username and password in the content.
        :return: If authenticated, returns status 200 (OK), the token, else, status 401 (unauthorized).
        """
        
        content = request.json
        username = content['username']
        password = content['password']
        authenticated_user = auth(username, password)

        if authenticated_user:
            token = create_access_token(identity=authenticated_user.uid)
            return jsonify({ 'token': token })

        return Response(status = 401)

class Signout(Resource):

    def post(self):
        response = Response(status = 200)
        unset_jwt_cookies(response)
        return response

class Signup(Resource):
    def post(self):
        content = request.json

        username = content['username']
        password = content['password']

        if find(username):
            return Response(status = 418)

        create(username, password)
        return Response(status = 200)
        