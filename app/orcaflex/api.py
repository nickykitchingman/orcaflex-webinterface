from app import app, db
from app.models import Job, JobStatus
from flask import session
from . import filing
import os
import json
import threading
from OrcFxAPI import Model, DLLError

def get_job(model):
    filename = model.latestFileName
    name = os.path.basename(filename)
    base, _ = os.path.splitext(name)

    job = Job.query.filter_by(
        filename = base
    ).first()

    if job:
        db.session.refresh(job)

    return job

def get_running_job(model):
    filename = model.latestFileName
    name = os.path.basename(filename)
    base, _ = os.path.splitext(name)

    job = Job.query.filter_by(
        filename = base, 
        status = JobStatus.Running
    ).first()

    if job:
        db.session.refresh(job)

    return job

def statics_progress_handler(model, progress):
    job = get_job(model)

    if job is None or job.status not in (JobStatus.Running, JobStatus.Paused):
        return True  # Kill job

    job.set_progress(progress)
    return False
    
def dynamics_progress_handler(model, time, start, stop):
    job = get_job(model)

    if job is None:
        return True
    elif job.status == JobStatus.Paused:
        model.PauseSimulation()
    elif job.status != JobStatus.Running:
        return True
        
    return False
    
def percent_progress_handler(model, percent):
    job = get_job(model)

    if job is None or job.status not in (JobStatus.Running, JobStatus.Paused):
        return True

    return False

def run_jobs(jobs):
    def run_job(job_id, context):
        with context:
            try:
                job = db.session.get(Job, job_id)

                if job is None:
                    return
                 
                model = Model()
                model.staticsProgressHandler = statics_progress_handler
                model.dynamicsProgressHandler = dynamics_progress_handler
                model.progressHandler = percent_progress_handler
                
                load_path = os.path.join(filing.LOAD_PATH, job.full_filename())

                if job.status == JobStatus.Paused:      
                    load_path = os.path.join(filing.PAUSED_PATH, job.full_filename())

                job.set_progress('Loading')   

                model.LoadData(load_path)
                job.set_progress('Running')

                model.RunSimulation()

                path = os.path.join(filing.SAVE_PATH, job.sim_filename())

                if job.status == JobStatus.Paused:
                    path = os.path.join(filing.PAUSED_PATH, job.sim_filename())

                job.set_progress('Saving')
                model.SaveSimulation(path)      

                if job.status != JobStatus.Paused:      
                    job.completed(job.sim_filename())

            except DLLError as e:
                if e.status == 29:
                    job.cancelled()
                    app.logger.info('Simulation ended: Job cancelled')
                else:
                    job.failed(e.errorString) 
                    app.logger.error(f'{e}')  
            except Exception as e:
                job.failed('Server error')  
                app.logger.error(f'{e}')      

    for job in jobs:  
        try:
            threading.Thread(target=run_job, args=[job.id, app.app_context()]).start()
        except Exception as e:
            job.failed('Server error')
            app.logger.error(f'{e}')
        
def process_jobs(job_ids):
    jobs = []
    
    def is_duplicate(job): 
        return any(existing.filename == job.filename for existing in jobs)
    
    for job_id in set(job_ids):        
        try:
            job = db.session.get(Job, job_id)
            if job is not None and job.status != JobStatus.Running and not is_duplicate(job):
                job.started()
                jobs.append(job)
        except Exception as e:
            job.failed('Server error')
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

def pause_jobs(job_ids):
    jobs = Job.query.filter(
        Job.id.in_(job_ids)
    ).update(
        values={
            'status': JobStatus.Paused,
            'progress': 'Paused'
        }
    )
    
    db.session.commit()

def stop_jobs(job_ids):
    jobs = Job.query.filter(
        Job.id.in_(job_ids)
    ).update(
        values={
            'status': JobStatus.Cancelled, 
            'progress': 'Cancelled'
        }
    )
    
    db.session.commit()
    
    