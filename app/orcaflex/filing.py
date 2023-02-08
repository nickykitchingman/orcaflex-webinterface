from app import app, db
from app.models import Job, JobStatus
import os
import json
from werkzeug.utils import secure_filename
from io import BytesIO
from zipfile import ZipFile

DAT = 'dat'
YML = 'yml'
SIM = 'sim'
ALLOWED_EXTENSIONS = {DAT, YML, SIM}
LOAD_PATH = os.path.join(app.instance_path, app.config['FILES_FOLDER'], app.config['UPLOAD_FOLDER'])
SAVE_PATH = os.path.join(app.instance_path, app.config['FILES_FOLDER'], app.config['DOWNLOAD_FOLDER'])

def valid_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def add_job(filename):
    job = Job(filename)
    db.session.add(job)
    db.session.commit()

def add_jobs(filenames):
    for filename in filenames:
        job = Job(filename)
        db.session.add(job)
    db.session.commit()    

def save_files(files):
    filenames = []
    for file in files:
        if file and valid_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(LOAD_PATH, filename)
            file.save(path)
            filenames.append(filename)
    add_jobs(filenames)
    
def load_files_zip(filepaths):
    stream = BytesIO()
    
    with ZipFile(stream, 'w') as zf:
        for path in filepaths:
            name = os.path.basename(path)
            zf.write(path, os.path.join('results', name))
            
    stream.seek(0)    
    return stream
    
def get_all_files():
    uploads = os.listdir(LOAD_PATH)
    processed = os.listdir(SAVE_PATH) 
    return uploads, processed
    
def get_all_jobs():
    return Job.query.all()

def get_all_jobs_json():
    jobs = get_all_jobs()
    dicts = [job.get_dict() for job in jobs]
    return json.dumps(dicts)
    
def get_sim_path(job_id):
    job = db.session.get(Job, job_id)
    if job is None or job.status != JobStatus.Complete:
        return None
    
    path = os.path.join(SAVE_PATH, job.sim_filename)
    return path, job.sim_filename