from app import db
import os
import enum
from werkzeug.security import generate_password_hash
import threading

lock = threading.Lock()

@enum.unique
class JobStatus(enum.IntEnum):
    Pending = 0
    Running = 1
    Complete = 2
    Failed = 3
    Cancelled = 4
    Paused = 5

class Job(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    filename = db.Column(db.String(512))
    extension = db.Column(db.String(16))
    status = db.Column(db.Integer)
    progress = db.Column(db.String(512))
    user_id = db.Column(db.String(32))

    def __init__(self, filename, user_id):
        base, ext = os.path.splitext(filename)
        self.filename = base
        self.extension = ext[1:]
        self.status = JobStatus.Pending
        self.user_id = user_id
    
    def get_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns} 
       
    def full_filename(self):
        return f'{self.filename}.{self.extension}'

    def sim_filename(self):
        return f'{self.filename}.sim'
    
    def set_status(self, status):
        with lock:
            db.session.rollback()
            
            self.status = status
            db.session.commit()
    
    def set_progress(self, progress):
        with lock:
            db.session.rollback()
            
            self.progress = progress
            
            db.session.commit()
    
    def started(self):
        with lock:
            db.session.rollback()
            
            self.status = JobStatus.Running
            self.progress = 'Queued'
            db.session.commit()
    
    def completed(self, filename):   
        with lock:
            db.session.rollback()
            
            self.status = JobStatus.Complete
            self.progress = ''
            db.session.commit()
        
    def failed(self, progress):
        with lock:
            db.session.rollback()
            
            self.status = JobStatus.Failed
            self.progress = progress
            db.session.commit()
        
    def paused(self):
        with lock:
            db.session.rollback()
            
            self.status = JobStatus.Paused
            self.progress = 'Paused'
            db.session.commit()
    
    def cancelled(self):
        with lock:
            db.session.rollback()
            
            self.status = JobStatus.Cancelled
            self.progress = 'Cancelled'
            db.session.commit()
    
    def running_or_complete(self):
        return self.status in (JobStatus.Running, JobStatus.Complete)
        
    @staticmethod
    def pause(job_ids):
        with lock:
            jobs = Job.query.filter(
                Job.id.in_(job_ids)
            ).update(
                values={
                    'status': JobStatus.Paused, 
                    'progress': 'Paused'
                }
            )
            
            db.session.commit()
            
    @staticmethod
    def stop(job_ids):
        with lock:
            jobs = Job.query.filter(
                Job.id.in_(job_ids)
            ).update(
                values={
                    'status': JobStatus.Cancelled, 
                    'progress': 'Cancelled'
                }
            )
            
            db.session.commit()

class User(db.Model):
    uid = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(32))
    password_hash = db.Column(db.String(32))

    def __init__(self, username, password):
        self.username = username
        self.password_hash = generate_password_hash(password)

    def get_id(self) -> str:
        return str(self.uid)