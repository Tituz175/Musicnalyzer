import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
# from werkzeug.utils import secure_filename
from flask_pymongo import PyMongo
# from bson import ObjectId
# from pydub import AudioSegment  # Added for conversion
from controllers.song_controller import SongController
# from utils.handle_load import load_song, analyze_song, extract_lyrics, extract_vocals_instrumentals, move_file
# from utils.handle_key import change_key, generate_vocal_parts
# from utils.handle_bpm import change_bpm
# from utils.handle_dir import delete_files_except_one

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/musicnalyzer"
app.config["UPLOAD_FOLDER"] = "uploads"  # Ensure you have an "uploads" folder
app.config["ALLOWED_EXTENSIONS"] = {"mp3", "wav"}  # Allow both mp3 and wav
mongo = PyMongo(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS

# Ensure the upload folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


song_controller = SongController(mongo)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]


@app.route("/insert", methods=["POST"])
def insert_song():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    is_solo = request.form.get('isSolo').capitalize()

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        original_filename = secure_filename(file.filename)
        file_base_name = os.path.splitext(original_filename)[0]
        file_extension = os.path.splitext(original_filename)[1].lower()
        wav_filename = f"{file_base_name}.wav"

        # Check if the song already exists in the database
        existing_song = mongo.db.songs.find_one({"song": original_filename})

        # Use existing song ID or create a single new ObjectId for this session
        song_id = str(existing_song["_id"]) if existing_song else str(ObjectId())
        song_folder = os.path.join(app.config["UPLOAD_FOLDER"], song_id)
        os.makedirs(song_folder, exist_ok=True)  # Create the subfolder if it doesn't exist

        # Check if a similar file exists on the server
        existing_files = [file for file in os.listdir(song_folder) if file.startswith(file_base_name) and file.endswith('.wav')]

        # Re-upload only if no matching file exists
        if not existing_files:
            file_path = os.path.join(song_folder, wav_filename)

            # Convert or save file
            if file_extension == '.mp3':
                audio = AudioSegment.from_mp3(file)
                audio.export(file_path, format="wav")
            else:
                file.save(file_path)

            # Load and analyze the song
            audio, sample_rate = load_song(file_path)
            key, bpm = analyze_song(audio, sample_rate, file_path)
            modified_filename = f"{file_base_name}_KEY_{key}_BPM_{bpm}.wav"
            modified_file_path = os.path.join(song_folder, modified_filename)

            # Rename if necessary
            if not os.path.exists(modified_file_path):
                os.rename(file_path, modified_file_path)

            stems_name = extract_vocals_instrumentals(modified_file_path)

            soprano, instrumental = move_file(song_folder, *stems_name)

            if is_solo == "True":
                print(is_solo)
                alto, tenor = generate_vocal_parts(soprano)
            else:
                alto = ""
                tenor = ""

            # Insert or update song details in the database
            song_data = {
                "_id": existing_song["_id"] if existing_song else ObjectId(song_id),  # Use the same ObjectId
                "song": original_filename,
                "artist": request.form.get("artist", ""),
                "paths": modified_file_path,
                "duration": float(request.form.get("duration", "0")),
                "musical_key": key,
                "song_tempo": bpm,
                "lyrics": request.form.get("lyrics", ""),
                "musical_parts": {
                    "soprano_path": soprano,
                    "alto_path": alto,
                    "tenor_path": tenor,
                    "instrumental_path": instrumental
                }
            }

            if existing_song:
                mongo.db.songs.update_one({"_id": existing_song["_id"]}, {"$set": song_data})
                message = "Song re-uploaded and database updated"
            else:
                mongo.db.songs.insert_one(song_data)
                message = "Song uploaded and database entry created"

            return jsonify({
                "status": message,
                "song_id": song_id
            }), 200

            # return jsonify({
            #     "data": "work in progress"
            # })

        else:
            return jsonify({
                "message": "Song file already exists on the server, upload skipped",
                "song_id": song_id
            }), 200

    else:
        return jsonify({"error": "File type not allowed"}), 400



@app.route('/uploads/<song_id>/<path:filename>', methods=['GET'])
def serve_audio(song_id, filename):
    # Construct the full path to the file
    return send_from_directory(os.path.join(app.config["UPLOAD_FOLDER"], song_id), filename)


@app.route("/songs/<song_id>", methods=["GET"])
def get_song_by_id(song_id):
    print(song_id)
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
        # print(data)
        value = data.get('value')
        current_key = data.get('currentKey')
        current_bpm = data.get('currentBPM') 
        current_audio_stem = data.get('currentAudioStems')
        print(current_audio_stem)
        current_audio_stem = { key: os.path.normpath(value).split('5000')[-1].replace('%2F', '/').lstrip('/\\') for key, value in current_audio_stem.items() if value != None }
        


        major_key_list = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        minor_key_list = ['Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m']
        new_key = ""

        if 'm' in current_key:
            new_index = (minor_key_list.index(current_key) + value) % 12
            new_key = minor_key_list[new_index]
        else:
            new_index = (major_key_list.index(current_key) + value) % 12
            new_key = major_key_list[new_index]

        current_audio_stem = { key: value.replace('%23', '#') for key, value in current_audio_stem.items() }

        overall_data = {"new_key": new_key}


        for data in current_audio_stem.items():
            audio, sample_rate = load_song(data[1])
            file_path = change_key(audio, sample_rate, value, data[1], new_key)
            if "#" in file_path:
                file_path = file_path.replace('#', '%23')
            overall_data[data[0]] = file_path
        
        print(overall_data)

        return jsonify(overall_data)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Error changing key: {e}"}), 500


@app.route('/change_bpm', methods=['POST'])
def modify_bpm():
    try:
        data = request.get_json()
        print(data)
        value = data.get('value')
        current_bpm = data.get('currentBPM')
        value_bpm = current_bpm + value
        current_audio_stem = data.get('currentAudioStems')    
        print(current_audio_stem)
        current_audio_stem = { key: os.path.normpath(value).split('5000')[-1].replace('%2F', '/').lstrip('/\\') for key, value in current_audio_stem.items() if value != None }

        current_audio_stem = { key: value.replace('%23', '#') for key, value in current_audio_stem.items() if "%23" in value }

        overall_data = {"new_bpm": value_bpm}

        for data in current_audio_stem.items():
            file_path = change_bpm(data[1], current_bpm, value_bpm)
            if "#" in file_path:
                file_path = file_path.replace('#', '%23')
            overall_data[data[0]] = file_path

        print(overall_data)
        return jsonify(overall_data)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    

@app.route('/reset', methods=['POST'])
def reset_modifications():
    data = request.get_json()
    song_details = song_controller.get_song_by_id(data.get('songId'))
    paths = song_details.get('paths')
    soprano_path = song_details["musical_parts"]["soprano_path"]
    alto_path = song_details["musical_parts"]["alto_path"]
    tenor_path = song_details["musical_parts"]["tenor_path"]
    instrumental_path = song_details["musical_parts"]["instrumental_path"]

    current_audio_stem = [soprano_path, alto_path, tenor_path, instrumental_path]

    directory = os.path.dirname(paths)
    delete_files_except_one(directory, *current_audio_stem)

    for i in range(len(current_audio_stem)):
        if "#" in current_audio_stem[i]:
            path = current_audio_stem[i].replace('#', '%23')
            current_audio_stem[i] = path

    return jsonify({"soprano": current_audio_stem[0], "alto": current_audio_stem[1], "tenor": current_audio_stem[2],  "instrumental": current_audio_stem[-1]})


@app.route('/get_lyrics', methods=['POST'])
def get_lyrics():
    try:
        data = request.get_json()

        print(data)
        song_id = data.get('songId')
        song_details = song_controller.get_song_by_id(song_id)
        lyrics = song_details.get('lyrics')

        if not lyrics:
            path = song_details["musical_parts"]["soprano_path"]
            lyrics = extract_lyrics(path)
            res = song_controller.update_song_by_id(song_id, {"lyrics" : lyrics})
            print(res)
            return jsonify({"lyrics": lyrics})
        return jsonify({"lyrics": lyrics})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
