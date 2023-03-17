from app import app
from .api import update_workers
from . import filing
import os
import threading
from time import sleep

os.makedirs(filing.LOAD_PATH, exist_ok=True)
os.makedirs(filing.SAVE_PATH, exist_ok=True)
os.makedirs(filing.PAUSED_PATH, exist_ok=True)

def update():
    while True:
        update_workers()
        sleep(app.config['WORKER_UPDATE_INTERVAL'])

threading.Thread(target=update, args=[], daemon=True, name="Worker-Update").start()
    
with app.app_context():
    jobs = filing.get_all_running_jobs()
    if len(jobs) > 0:
        app.logger.info(f'Failing {len(jobs)} jobs')
    for job in jobs:
        job.failed('Server restarted')
