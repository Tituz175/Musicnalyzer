import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_caching import Cache
from werkzeug.utils import secure_filename
from flask_pymongo import PyMongo
from controllers import SongController
from utils.handle_load import load_song, analyze_song
from utils.handle_key import change_key

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/musicnalyzer"
app.config["UPLOAD_FOLDER"] = "uploads"  # Ensure you have an "uploads" folder
app.config["ALLOWED_EXTENSIONS"] = {"mp3"}  # Restrict file types
app.config['CACHE_TYPE'] = 'RedisCache'
app.config['CACHE_REDIS_HOST'] = 'localhost'
app.config['CACHE_REDIS_PORT'] = 6379

cache = Cache(app)
mongo = PyMongo(app)
CORS(app)  # Enable CORS

# Ensure the upload folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

CACHE_DURATION = 60 * 60

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

        # Check if the song already exists in the database
        existing_song = mongo.db.songs.find_one({"song": filename})

        if existing_song:
            # If the song exists, return its ID
            return jsonify({
                "message": "Song already exists",
                "song_id": str(existing_song["_id"])
            }), 200

        # If song is not in the database, proceed with uploading
        file.save(file_path)

        # Load the song (audio and sample rate)
        audio, sample_rate = load_song(file_path)

        # Analyze the song
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
            "musical_parts": {
                "soprano_path": request.form.get("soprano_path", ""),
                "alto_path": request.form.get("alto_path", ""),
                "tenor_path": request.form.get("tenor_path", ""),
                "instrumental_path": request.form.get("instrumental_path", "")
            }
        }

        # Call the song controller to insert the song data
        song_id = song_controller.insert_song(song_data)

        song_data_cache = {
            'filename': filename,
            'key': key,
            'bpm': bpm,
            'audio': audio,
            'sample_rate': sample_rate
        }

        # Cache the analyzed song data for 1 hour
        # Cache song data for 1 hour
        cache.set(song_id, song_data_cache, timeout=CACHE_DURATION)

        return jsonify({
            "status": "Document inserted successfully",
            "song_id": song_id  # Convert ObjectId to string for JSON serialization
        }), 200

        # return
    else:
        return jsonify({"error": "File type not allowed"}), 400


@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_audio(filename):
    print(f"This the filename: {filename}")
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
def modify_key():
    try:
        data = request.get_json()
        song_id = data.get('song_id')
        song_cached_data = cache.get(song_id)

        # If the song is not cached, retrieve it and cache it
        if not song_cached_data:
            song_details = song_controller.get_song_by_id(song_id)
            audio, sample_rate = load_song(song_details.get("paths"))
            song_data_cache = {
                'path': song_details.get("paths"),
                'filename': song_details.get('filename'),
                'key': song_details.get('musical_key'),
                'bpm': song_details.get('song_tempo'),
                'audio': audio,
                'sample_rate': sample_rate
            }
            # Cache the analyzed song data for 1 hour
            cache.set(song_id, song_data_cache, timeout=CACHE_DURATION)
            song_cached_data = song_data_cache  # Use the song_data_cache for further use
        else:
            # No need to get song_details if cached data is found
            song_details = None  # Just for clarity that this will not be used


        name = song_cached_data.get("filename").split(".mp3")[0]
        keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

        # Original key index from cache
        original_key_index = keys.index(song_cached_data.get('key'))

        # Get the initial key passed from the request
        initial_key = data.get('initialKey')

        # Calculate the new key index from the provided key
        initial_key_index = keys.index(initial_key)

        # Calculate the index difference (pitch shift value)
        value = (initial_key_index - original_key_index) + data.get('value')

        # Ensure value wraps correctly if keys go around the list (mod 12)
        if value > 6:  # If the difference is greater than 6, adjust the shift to avoid going in the wrong direction
            value = value - 12
        elif value < -6:
            value = value + 12

        new_key = keys[(original_key_index + value) % 12]

        # If no change in key, return original song details
        if value == 0:
            return jsonify({"new_path": song_cached_data.get('path'), "new_key": song_cached_data.get('key')})

        # Call the change_key function with the correct pitch shift value
        new_song_data = change_key(song_cached_data.get('audio'), song_cached_data.get(
            'sample_rate'), value, name, new_key)

        return jsonify(new_song_data)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Error changing key: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
