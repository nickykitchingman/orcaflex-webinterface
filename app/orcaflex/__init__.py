from app import app
from . import filing
import os

os.makedirs(filing.LOAD_PATH, exist_ok=True)
os.makedirs(filing.SAVE_PATH, exist_ok=True)