from app import db
from app.models import Job, JobStatus
from flask import session
from . import filing
import os
import json
from OrcFxAPI import Model    

def process_files(filenames):
    sim_filenames = []
    for filename in filenames:
        base, _ = os.path.splitext(filename)
        load_path = os.path.join(filing.LOAD_PATH, filename)
        
        model = Model(load_path)
        model.RunSimulation()
        
        sim_name = f'{base}.{filing.SIM}'
        path = os.path.join(filing.SAVE_PATH, sim_name)
        model.SaveSimulation(path)  
        
        sim_filenames.append(sim_name)
    return sim_filenames
    
def process_job(job_id):
    job = db.session.get(Job, job_id)
    if job is None:
        return None
        
    job.set_status(JobStatus.Running)
        
    try:
        filenames = process_files([job.filename])
    except Exception as e:
        job.set_status(JobStatus.Failed)
        return job
        
    if len(filenames) == 0:
        job.set_status(JobStatus.Failed)
        return job
        
    job.completed(filenames[0])
    return job
    
    