from app import app
from flask import request, render_template
from flask_restful import Resource

@app.route('/', methods=['GET'])
def home():
    return render_template("home.html", title="home")

class FileSubmission(Resource):
    def post(self):
        files = request.files.getlist('files')

        print(files)

        return {'message': 'Processing files'}