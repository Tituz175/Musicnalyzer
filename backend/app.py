import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_pymongo import PyMongo
from controllers import SongController

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/musicnalyzer"
app.config["UPLOAD_FOLDER"] = "uploads"  # Ensure you have an "uploads" folder
app.config["ALLOWED_EXTENSIONS"] = {"mp3"}  # Restrict file types

mongo = PyMongo(app)
CORS(app)  # Enable CORS

# Ensure the upload folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

song_controller = SongController(mongo)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]


@app.route("/")
def hello():
    return song_controller.get_all_songs()

@app.route("/insert", methods=["POST"])
def insert_song():
    # Check if the 'file' part is in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    # Check if a file was actually uploaded
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Validate the file extension
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

        # Prepare song data to insert into MongoDB
        song_data = request.form.to_dict()  # Fetch additional form data
        song_data['file_path'] = file_path  # Add file path to the song data

        # Prepare song data for MongoDB insertion
        song_data = {
            "song": filename,
            "artist": request.form.get("artist", ""),
            "paths": file_path,
            "musical_key": request.form.get("musical_key", ""),
            "song_tempo": request.form.get("song_tempo", ""),
            "lyrics": request.form.get("lyrics", ""),
            "musical_parts":{
                "soprano_path": request.form.get("soprano_path", ""),
                "alto_path": request.form.get("alto_path", ""),
                "tenor_path": request.form.get("tenor_path", ""),
                "instrumental_path": request.form.get("instrumental_path", "")
            }
        }

        # Call the song controller to insert the song data
        return song_controller.insert_song(song_data)
    else:
        return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    app.run(debug=True)
