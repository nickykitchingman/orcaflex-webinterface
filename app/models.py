from app import db
import os
import enum

@enum.unique
class JobStatus(enum.IntEnum):
    Pending = 0
    Running = 1
    Complete = 2
    Failed = 3

class Job(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    filename = db.Column(db.String(512))
    extension = db.Column(db.String(16))
    status = db.Column(db.Integer)
    
    def __init__(self, filename):
        base, ext = os.path.splitext(filename)
        self.filename = base
        self.extension = ext[1:]
        self.status = JobStatus.Pending
    
    def get_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns} 
       
    def full_filename(self):
        return f'{self.filename}.{self.extension}'

    def sim_filename(self):
        return f'{self.filename}.sim'
    
    def set_status(self, status):
        self.status = status
        db.session.commit()
    
    def completed(self, filename):   
        self.status = JobStatus.Complete
        db.session.commit()
    
    def running_or_complete(self):
        return self.status in (JobStatus.Running, JobStatus.Complete)