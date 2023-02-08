from app import app
from app.orcaflex import filing, api
from flask import request, render_template, send_file, Response, jsonify
from flask_restful import Resource

class FileSubmission(Resource):
    def post(self):
        files = request.files.getlist('files')
        filing.save_files(files)
        
class JobList(Resource):
    def get(self):
        jobs = filing.get_all_jobs_json()
        return Response(jobs, mimetype='application/json')

class ProcessJob(Resource):
    def post(self):
        content = request.json
        job = content['job']
        sim = api.process_job(job)
        return jsonify({'job': sim.get_dict()})

class DownloadJob(Resource):
    def post(self):
        content = request.json
        job_id = content['job']
        path, filename = filing.get_sim_path(job_id)
        
        if path is not None:
            return send_file(path, as_attachment=True, download_name=filename)