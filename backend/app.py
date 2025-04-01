"""
This module defines a Flask web application for managing a music database, including song uploads,
retrieval, and various modifications such as changing song key, BPM, and extracting lyrics.
The application integrates with a MongoDB database and allows CORS for specified origins.

Routes:
    - POST /insert: Upload a new song to the database with associated metadata.
    - GET /uploads/<song_id>/<filename>: Retrieve an audio file by song ID and filename.
    - GET /songs/<song_id>: Retrieve song metadata by song ID.
    - POST /change_key: Modify the musical key of a song.
    - POST /change_bpm: Modify the BPM (tempo) of a song.
    - POST /reset: Reset modifications made to a song.
    - POST /get_lyrics: Extract lyrics from a song.

Dependencies:
    - Flask, Flask-CORS, Flask-PyMongo, and MongoDB.
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from controllers.song_controller import SongController 

# Application configuration
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/musicnalyzer"
app.config["UPLOAD_FOLDER"] = "uploads"  # Ensure you have an "uploads" folder
app.config["ALLOWED_EXTENSIONS"] = {"mp3", "wav"}  # Allow both mp3 and wav
mongo = PyMongo(app)
app.config['mongo'] = mongo
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Initialize application controller
song_controller = SongController(mongo)



@app.route("/insert", methods=["POST"])
def insert_song():
    """
    Insert a new song into the database with uploaded audio, artist details, and duration.

    Request data:
        - file: Audio file to upload.
        - isSolo (str): Whether the song is a solo performance.
        - artist (str): Name of the artist.
        - duration (str): Duration of the song in seconds.

    Returns:
        Response: JSON response indicating success or failure of the operation.
    """
    file = request.files.get('file')
    if not file or file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    is_solo = request.form.get('isSolo').capitalize()
    artist = request.form.get('artist', "")
    duration = request.form.get('duration', "0")

    response = song_controller.insert_song(app, file, is_solo, artist, duration)
    return jsonify(response), response.get("status_code", 200)


@app.route('/uploads/<song_id>/<path:filename>', methods=['GET'])
def serve_audio(song_id, filename):
    """
    Serve an uploaded audio file from the server.

    Parameters:
        song_id (str): ID of the song to retrieve.
        filename (str): Name of the file within the song's directory.

    Returns:
        Response: Audio file to be sent to the client.
    """
    return send_from_directory(os.path.join(app.config["UPLOAD_FOLDER"], song_id), filename)


@app.route("/songs/<song_id>", methods=["GET"])
def get_song_by_id(song_id):
    """
    Retrieve song metadata from the database using the song ID.

    Parameters:
        song_id (str): Unique identifier of the song.

    Returns:
        Response: JSON object containing song details if found, or an error message if not.
    """
    try:
        song_details = song_controller.get_song_by_id(song_id)
        if song_details is None:
            return jsonify({"error": "Song not found"}), 404
        return jsonify(song_details), 200
    except Exception as e:
        return jsonify({"error": f"Error fetching song: {e}"}), 500


@app.route('/change_key', methods=['POST'])
def modify_key():
    """
    Modify the musical key of a song and store the updated version.

    Request data:
        - JSON object containing song ID and key modification details.

    Returns:
        Response: JSON object with updated song key data or error information.
    """
    try:
        data = request.get_json()
        new_key_data = song_controller.change_key(data)
        return jsonify(new_key_data)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Error /change_key endpoint: {e}"}), 500


@app.route('/change_bpm', methods=['POST'])
def modify_bpm():
    """
    Modify the BPM (tempo) of a song and store the updated version.

    Request data:
        - JSON object containing song ID and BPM modification details.

    Returns:
        Response: JSON object with updated song BPM data or error information.
    """
    try:
        data = request.get_json()
        new_bpm_data = song_controller.change_bpm(data)
        return jsonify(new_bpm_data)
    except Exception as e:
        print(f"Error in /change_bpm endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/reset', methods=['POST'])
def reset_modifications():
    """
    Reset all modifications made to a song, returning it to its original state.

    Request data:
        - JSON object containing song ID.

    Returns:
        Response: JSON object indicating success or failure of the reset operation.
    """
    try:
        data = request.get_json()
        song_id = data.get('songId')
        result = song_controller.reset_modifications(song_id)
        return jsonify(result)
    except Exception as e:
        print(f"Error in /reset endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/get_lyrics', methods=['POST'])
def get_lyrics():
    """
    Extract lyrics from a song and return them as text.

    Request data:
        - JSON object containing song ID.

    Returns:
        Response: JSON object with lyrics or error information.
    """
    try:
        data = request.get_json()
        song_id = data.get('songId')
        result = song_controller.get_lyrics(song_id)
        return jsonify(result)
    except Exception as e:
        print(f"Error in /get_lyrics endpoint: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    