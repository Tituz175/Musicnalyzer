import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_pymongo import PyMongo
from controllers import SongController
from utils.handle_load import load_song, analyze_song

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

        audio, sample_rate = load_song(file_path)
        key, bpm = analyze_song(audio, sample_rate)

        # Prepare song data to insert into MongoDB
        song_data = request.form.to_dict()  # Fetch additional form data
        song_data['file_path'] = file_path  # Add file path to the song data

        # Prepare song data for MongoDB insertion
        song_data = {
            "song": filename,
            "artist": request.form.get("artist", ""),
            "paths": file_path,
            "duration": float(request.form.get("duration", "0")),
            "musical_key": key,
            "song_tempo": bpm,
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

@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_audio(filename):
    return send_from_directory('uploads', filename)

@app.route("/songs/<song_id>", methods=["GET"])
def get_song_by_id(song_id):
    try:
        # Fetch the song details using the song_id
        song_details = song_controller.get_song_by_id(song_id)
        
        if song_details is None:
            return jsonify({"error": "Song not found"}), 404

        # Return song details including the path to the song file
        return jsonify(song_details), 200
    except Exception as e:
        print({e})
        return jsonify({"error": f"Error fetching song: {e}"}), 500


@app.route('/change_key', methods=['POST'])
def method_name():
    pass


if __name__ == '__main__':
    app.run(debug=True)
