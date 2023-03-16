from app import app, db
from app.models import Job, JobStatus
from flask import session
from . import filing
import os
import json
import threading
from OrcFxAPI import Model, DLLError
import multiprocessing

# default to max
MAXIMUM_ACTIVE_WORKERS = multiprocessing.cpu_count()
worker_queue = []

class Worker:
    def __init__(self, job, target, args):
        # the job is processing / has processed
        self.active = False
        
        # the job has finished processing
        self.completed = False
            
        self.target = target
        self.args = args
        self.attempts = 0
        
        self.job = job

    def deploy(self):
        self.attempts += 1
        
        def wrapper(job_id, is_paused, context):
            self.active = True
            self.target(job_id, is_paused, context)
            self.completed = True
            
        threading.Thread(target=wrapper, args=self.args).start()

def update_workers():
    if len(worker_queue) == 0:
        return
        
    # remove completed workers
    completed_workers = list(filter(lambda worker: worker.completed or worker.job.status == JobStatus.Cancelled, worker_queue))
        
    # failed workers
    for worker in worker_queue:
    
        # tried and failed to process
        if worker.active and worker.job.status == JobStatus.Failed:
        
            # retry max of 3 times
            if worker.attempts < 3:
                worker.deploy()
                
            # mark worker for removal
            else:
                completed_workers.append(worker)
        
    for worker in completed_workers:
        worker_queue.remove(worker)
        
    active_count = len(list(filter(lambda worker: worker.active, worker_queue)))

    #print(active_count)

    if active_count < MAXIMUM_ACTIVE_WORKERS:
        for worker in worker_queue:
            if active_count >= MAXIMUM_ACTIVE_WORKERS:
                break
                
            if not worker.active:
                worker.deploy()
                active_count += 1

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

def run_jobs(jobs, paused_jobs):
    def run_job(job_id, is_paused, context):
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

                if is_paused:      
                    load_path = os.path.join(filing.PAUSED_PATH, job.sim_filename())

                job.set_progress('Loading')   

                model.LoadData(load_path)
                job.set_progress('Running')

                model.RunSimulation()

                path = os.path.join(filing.SAVE_PATH, job.sim_filename())

                if job.status == JobStatus.Paused:
                    path = os.path.join(filing.PAUSED_PATH, job.sim_filename())

                job.set_progress('Saving')
                model.SaveSimulation(path)      

                if job.status == JobStatus.Paused:
                    job.paused()
                else:    
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
            is_paused = job.id in paused_jobs
            worker_queue.append(Worker(job=job, target=run_job, args=[job.id, is_paused, app.app_context()]))
        except Exception as e:
            job.failed('Server error')
            app.logger.error(f'{e}')
  
def process_jobs(job_ids):
    jobs = []
    paused_jobs = set()
    
    def is_duplicate(job): 
        return any(existing.filename == job.filename for existing in jobs)
    
    for job_id in set(job_ids):        
        try:
            job = db.session.get(Job, job_id)
            if job is not None and job.status != JobStatus.Running and not is_duplicate(job):
                if job.status == JobStatus.Paused:
                    paused_jobs.add(job_id)
                    
                job.started()
                jobs.append(job)
                
        except Exception as e:
            job.failed('Server error')
            app.logger.error(f'{e}')
        
    if len(jobs) == 0:
        return []
        
    run_jobs([job for job in jobs], paused_jobs)
    
    update_workers()
        
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
    
    worker_queue.clear()
    
    db.session.commit()
    