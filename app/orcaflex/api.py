from app import app, db
from app.models import Job, JobStatus
from flask import session
from . import filing
import os
import json
import threading
from OrcFxAPI import Model    

def get_job(model):
    filename = model.latestFileName
    name = os.path.basename(filename)
    base, _ = os.path.splitext(name)
    return Job.query.filter_by(
        filename = base, 
        status = JobStatus.Running
    ).first()

def statics_progress_handler(model, progress):
    job = get_job(model)
    if job is None:
        return True  # Kill job
    return False
    
def dynamics_progress_handler(model, time, start, stop):
    job = get_job(model)
    if job is None:
        return True
    return False
    
def percent_progress_handler(model, percent):
    job = get_job(model)
    if job is None:
        return True
    return False

def run_jobs(jobs):
    def run_job(job_id, context):
        with context:
            try:
                job = db.session.get(Job, job_id);
                if job is None:
                    return
                 
                model = Model()
                model.staticsProgressHandler = statics_progress_handler
                model.dynamicsProgressHandler = dynamics_progress_handler
                model.progressHandler = percent_progress_handler
                   
                load_path = os.path.join(filing.LOAD_PATH, job.full_filename())
                model.LoadData(load_path)
                model.RunSimulation()
                
                path = os.path.join(filing.SAVE_PATH, job.sim_filename())
                model.SaveSimulation(path)            
                job.completed(job.sim_filename())
            except Exception as e:
                job.set_status(JobStatus.Failed)  
                app.logger.error(f'{e}')      

    for job in jobs:  
        try:
            threading.Thread(target=run_job, args=[job.id, app.app_context()]).start()
        except Exception as e:
            job.set_status(JobStatus.Failed)
            app.logger.error(f'{e}')
        
        
def process_jobs(job_ids):
    jobs = []
    
    def is_duplicate(job): 
        return any(existing.filename == job.filename for existing in jobs)
    
    for job_id in set(job_ids):        
        try:
            job = db.session.get(Job, job_id)
            if job is not None and job.status != JobStatus.Running and not is_duplicate(job):
                job.set_status(JobStatus.Running)
                jobs.append(job)
        except Exception as e:
            job.set_status(JobStatus.Failed)
            app.logger.error(f'{e}')
        
    if len(jobs) == 0:
        return []
        
    run_jobs([job for job in jobs])
        
    return jobs
    
def process_job(job_id):
    jobs = process_jobs([job_id])
    
    if len(jobs) == 0:
        return None
    return jobs[0]

def stop_jobs(job_ids):
    jobs = Job.query.filter(
        Job.id.in_(job_ids)
    ).update(
        values={'status': JobStatus.Failed}
    )
    db.session.commit()
    
    