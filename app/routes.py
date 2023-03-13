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
    def post(self):
        content = request.json
        ids = list(map(int, content['jobs']))
        jobs = filing.get_jobs(ids)
        dicts = [job.get_dict() for job in jobs]
        return jsonify({'jobs': dicts})

class ProcessJob(Resource):
    def post(self):
        content = request.json
        job = content['job']
        sim = api.process_job(job)

        if sim:
            return jsonify({'job': sim.get_dict()})

class ProcessJobs(Resource):
    def post(self):
        content = request.json
        jobs = content['jobs']
        sims = api.process_jobs(jobs)
        dicts = [sim.get_dict() for sim in sims]
        return jsonify({'jobs': dicts})

class DownloadJob(Resource):
    def post(self):
        content = request.json
        job_id = content['job']
        path, filename = filing.get_sim_path(job_id)
        
        if path is not None:
            return send_file(path, as_attachment=True, download_name=filename)

class ClearJobs(Resource):
    def get(self):
        filing.clear_jobs()

class PauseJobs(Resource):
    def post(self):
        content = request.json
        jobs = content['jobs']
        api.pause_jobs(jobs)

class StopJobs(Resource):
    def post(self):
        content = request.json
        job_ids = content['jobs']
        api.stop_jobs(job_ids)