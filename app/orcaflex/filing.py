from app import app
import os
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

def save_files(files):
    filepaths = []
    for file in files:
        if file and valid_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(LOAD_PATH, filename)
            file.save(path)
            filepaths.append(path)
    return filepaths
    
def load_files_zip(filepaths):
    stream = BytesIO()
    
    with ZipFile(stream, 'w') as zf:
        for path in filepaths:
            name = os.path.basename(path)
            zf.write(path, os.path.join('results', name))
            
    stream.seek(0)    
    return stream