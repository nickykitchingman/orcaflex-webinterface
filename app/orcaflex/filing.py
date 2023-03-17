from app import app, db
from app.models import Job, JobStatus
import os
import json
from flask import jsonify
from werkzeug.utils import secure_filename
from io import BytesIO
from zipfile import ZipFile

DAT = 'dat'
YML = 'yml'
SIM = 'sim'
ALLOWED_EXTENSIONS = {DAT, YML, SIM}
LOAD_PATH = os.path.join(app.instance_path, app.config['FILES_FOLDER'], app.config['UPLOAD_FOLDER'])
SAVE_PATH = os.path.join(app.instance_path, app.config['FILES_FOLDER'], app.config['DOWNLOAD_FOLDER'])
PAUSED_PATH = os.path.join(app.instance_path, app.config['FILES_FOLDER'], app.config['PAUSED_FOLDER'])

def valid_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def add_job(filename, user_id):
    job = Job(filename, user_id)
    db.session.add(job)
    db.session.commit()

def add_jobs(filenames, user_id):
    for filename in filenames:
        job = Job(filename, user_id)
        db.session.add(job)
        
    db.session.commit()    

def save_files(files, user_id):
    filenames = []
    
    for file in files:
        if file and valid_file(file.filename):
            filename = secure_filename(file.filename)
            user_path = os.path.join(LOAD_PATH, str(user_id))
            
            if not os.path.exists(user_path):
                os.mkdir(user_path)
            
            path = os.path.join(user_path, filename)
            
            file.save(path)
            filenames.append(filename)

    add_jobs(filenames, user_id)
    
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
    
def get_jobs(ids):
    return Job.query.filter(Job.id.in_(ids)).all()

def get_jobs_json(ids):
    jobs = get_jobs(ids)
    dicts = [job.get_dict() for job in jobs]
    return jsonify({'jobs': dicts})
    
def get_all_jobs(uid_filter = -1):
    if uid_filter >= 0:
        return Job.query.filter_by(user_id = uid_filter)

    return Job.query.all()

def get_all_jobs_json(uid_filter = -1):
    jobs = get_all_jobs(uid_filter)
    dicts = [job.get_dict() for job in jobs]
    return json.dumps(dicts)
    
def get_sim_path(job_id):
    job = db.session.get(Job, job_id)
    
    if job is None or job.status != JobStatus.Complete:
        return None
        
    path = os.path.join(os.path.join(filing.SAVE_PATH, job.user_id), job.sim_filename())
    
    return path, job.sim_filename()

def clear_jobs(uid):
    for job in get_all_jobs(uid):
        if job.status == JobStatus.Running:
            continue
    
        # Check if a duplicate job uses this filename
        if Job.query.filter(Job.id != job.id, Job.filename == job.filename).first() is None:
            load_file = os.path.join(os.path.join(filing.LOAD_PATH, job.user_id), job.full_filename())
            save_file = os.path.join(os.path.join(filing.SAVE_PATH, job.user_id), job.sim_filename())
            
            try:
                if job.filename != '':
                    os.remove(load_file)
                if job.sim_filename() != '':
                    os.remove(save_file)
            except OSError:
                pass  # Its okay for the files not to exist
            
        db.session.delete(job)
        db.session.commit()