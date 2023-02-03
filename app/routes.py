from app import app
from app.orcaflex import filing, api
from flask import request, render_template, send_file
from flask_restful import Resource

class FileSubmission(Resource):
    def post(self):
        files = request.files.getlist('files')

        load_paths = filing.save_files(files)
        save_paths = api.process_files(load_paths)
        results = filing.load_files_zip(save_paths)

        return send_file(
            results,
            as_attachment=True,
            download_name='results.zip'
        )