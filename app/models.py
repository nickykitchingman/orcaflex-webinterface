from app import db
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
    sim_filename = db.Column(db.String(512))
    status = db.Column(db.Integer)
    
    def __init__(self, filename):
        self.filename = filename
        self.sim_filename = ''
        self.status = JobStatus.Pending
    
    def get_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}    
    
    def set_status(self, status):
        self.status = status
        db.session.commit()
    
    def completed(self, filename):        
        self.sim_filename = filename
        self.status = JobStatus.Complete
        db.session.commit()