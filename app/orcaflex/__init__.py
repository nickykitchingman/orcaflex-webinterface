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
        sleep(0.1)

threading.Thread(target=update, args=[], daemon=True, name="Worker-Update").start()
