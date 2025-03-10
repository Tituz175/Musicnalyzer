"""
SongController module for managing song data, including upload, retrieval, 
and modification of song properties such as key, BPM, and lyrics extraction.

Classes:
    - SongController: Provides functions for handling song-related data, including
      insertion, retrieval, modification, and resetting to original state.

Dependencies:
    - SongModel: Data model class for MongoDB song document interactions.
    - Various utilities for file handling, audio processing, key/BPM adjustments, 
      path cleaning, and lyrics extraction.
"""


import os
import json
from bson import ObjectId
from models.song_model import SongModel
from werkzeug.utils import secure_filename
from utils.lyrics_utils import extract_lyrics
from utils.path_utils import clean_audio_paths, encode_special_chars
from utils.audio_processing import analyze_and_process_audio, load_song
from utils.key_bpm_utils import calculate_new_key, change_key, change_bpm
from utils.file_operations import allowed_file, save_song_file, delete_unwanted_files


class SongController:
    """
    Controller for song management, including upload, retrieval, 
    modification of musical properties, and reset operations.
    
    Attributes:
        song_model (SongModel): Instance of the SongModel class for database operations.
    """

    def __init__(self, mongo):
        """
        Initialize the SongController with a MongoDB client.

        Parameters:
            mongo: MongoDB client instance for database connections.
        """
        self.song_model = SongModel(mongo)

    def get_song_by_id(self, song_id):
        """
        Retrieve and return song metadata for a specified song ID.

        Parameters:
            song_id (str): Unique identifier of the song to retrieve.

        Returns:
            dict: Filtered song metadata if found, including filename, paths, duration,
                  key, tempo, lyrics, and musical parts.
            tuple: Error message and HTTP status code if song is not found.
        """
        song_details = self.song_model.find_song(song_id)
        print(song_details)

        if isinstance(song_details, str):
            try:
                # Convert the JSON string to a dictionary
                song_details = json.loads(song_details)
            except json.JSONDecodeError:
                return {"error": "Failed to decode song data"}, 500

        # Now, we assume song is a dictionary
        if isinstance(song_details, dict):
            # Create a new dictionary excluding the _id, song, and artist fields
            filtered_song = {
                "filename": song_details.get("song"),
                "paths": song_details.get("paths"),
                "duration": song_details.get("duration"),
                "musical_key": song_details.get("musical_key"),
                "song_tempo": song_details.get("song_tempo"),
                "lyrics": song_details.get("lyrics"),
                "musical_parts": song_details.get("musical_parts")
            }
            return filtered_song  # Return the filtered song details
        else:
            return {"error": "Song not found"}, 404
    

    def update_song_by_id(self, song_id, song_obj):
        """
        Update song metadata for a specified song ID in the database.

        Parameters:
            song_id (str): Unique identifier of the song to update.
            song_obj (dict): Dictionary containing the song properties to update.

        Returns:
            dict: JSON response indicating update success or failure.
        """
        return self.song_model.update_song(song_id, song_obj)
    
    def insert_song(self, app, file, is_solo, artist, duration, lyrics):
        """
        Insert a new song into the database, saving the audio file and metadata.

        Parameters:
            app (Flask): Flask application instance for accessing app configuration.
            file (FileStorage): Uploaded audio file to save.
            is_solo (str): Specifies if the song is a solo performance.
            artist (str): Name of the artist associated with the song.
            duration (str): Duration of the song in seconds.
            lyrics (str): Lyrics associated with the song.

        Returns:
            dict: JSON response with song ID and success or error message, including status code.
        """
        if not allowed_file(file.filename):
            return {"error": "File type not allowed", "status_code": 400}

        original_filename = secure_filename(file.filename)
        file_base_name = os.path.splitext(original_filename)[0]
        file_extension = os.path.splitext(original_filename)[1].lower()
        wav_filename = f"{file_base_name}.wav"

        # Check if song exists
        existing_song = self.song_model.find_song_by_name(original_filename)
        song_id = str(existing_song["_id"]) if existing_song else str(ObjectId())
        song_folder = os.path.join(app.config["UPLOAD_FOLDER"], song_id)
        os.makedirs(song_folder, exist_ok=True)

        # Check for existing files
        existing_files = [file for file in os.listdir(song_folder) if file.startswith(file_base_name) and file.endswith('.wav')]
        
        if not existing_files:
            file_path = save_song_file(file, song_folder, wav_filename, file_extension)

            # Analyze and extract parts
            key, bpm, soprano, alto, tenor, instrumental, modified_file_path = analyze_and_process_audio(
                file_path, file_base_name, song_folder, is_solo
            )

            # Prepare data for database
            song_data = {
                "_id": existing_song["_id"] if existing_song else ObjectId(song_id),
                "song": original_filename,
                "artist": artist,
                "paths": modified_file_path,
                "duration": float(duration),
                "musical_key": key,
                "song_tempo": bpm,
                "lyrics": lyrics,
                "musical_parts": {
                    "soprano_path": soprano,
                    "alto_path": alto,
                    "tenor_path": tenor,
                    "instrumental_path": instrumental
                }
            }

            # Insert/update in database
            if existing_song:
                self.song_model.update_song(existing_song["_id"], song_data)
                message = "Song re-uploaded and database updated"
            else:
                self.song_model.insert_song(song_data)
                message = "Song uploaded and database entry created"

            return {"status": message, "song_id": song_id, "status_code": 200}
        else:
            return {"message": "Song file already exists on the server, upload skipped", "song_id": song_id, "status_code": 200}
        
    def change_key(self, data):
        """
        Change the musical key of the song's audio stems.

        Parameters:
            data (dict): Contains 'value' (key change value), 'currentKey' (current key of the song), 
                         and 'currentAudioStems' (paths to audio files for modification).

        Returns:
            dict: JSON response with paths to modified audio stems and new key.
        """
        value = data.get('value')
        current_key = data.get('currentKey')
        current_audio_stem = data.get('currentAudioStems')

        # Normalize and clean paths
        current_audio_stem = clean_audio_paths(current_audio_stem)
        
        # Calculate the new key
        new_key = calculate_new_key(current_key, value)

        overall_data = {"new_key": new_key}

        # Process each audio stem
        for name, path in current_audio_stem.items():
            audio, sample_rate = load_song(path)
            file_path = change_key(audio, sample_rate, value, path, new_key)
            overall_data[name] = file_path
        
        return overall_data
    
    def change_bpm(self, data):
        """
        Change the BPM (tempo) of the song's audio stems.

        Parameters:
            data (dict): Contains 'value' (BPM change value), 'currentBPM' (current BPM), 
                         and 'currentAudioStems' (paths to audio files for modification).

        Returns:
            dict: JSON response with paths to modified audio stems and new BPM.
            tuple: Error message and HTTP status code if an error occurs.
        """
        try:
            # Parse input data
            value = data.get('value')
            current_bpm = data.get('currentBPM')
            value_bpm = current_bpm + value
            current_audio_stem = data.get('currentAudioStems')

            # Normalize paths and clean audio stem paths
            current_audio_stem = clean_audio_paths(current_audio_stem)

            overall_data = {"new_bpm": value_bpm}

            for name, path in current_audio_stem.items():
                file_path = change_bpm(path, current_bpm, value_bpm)
                overall_data[name] = file_path

            return overall_data

        except Exception as e:
            print(f"Error in modifying BPM: {e}")
            return {"error": str(e)}, 500

    def reset_modifications(self, song_id):
        """
        Reset song modifications, restoring original versions of audio stems.

        Parameters:
            song_id (str): Unique identifier of the song to reset.

        Returns:
            dict: JSON response with paths to restored audio stems.
            tuple: Error message and HTTP status code if song is not found or error occurs.
        """
        try:
            # Retrieve song details by song ID
            song_details = self.get_song_by_id(song_id)
            if not song_details:
                return {"error": "Song not found"}, 404

            paths = song_details.get('paths')
            soprano_path = song_details["musical_parts"]["soprano_path"]
            alto_path = song_details["musical_parts"]["alto_path"]
            tenor_path = song_details["musical_parts"]["tenor_path"]
            instrumental_path = song_details["musical_parts"]["instrumental_path"]

            # List of current audio stems to retain
            current_audio_stem = [soprano_path, alto_path, tenor_path, instrumental_path]

            # Delete all files in the directory except the current audio stems
            directory = os.path.dirname(paths)
            delete_unwanted_files(directory, *current_audio_stem)

            # Encode special characters in paths as needed
            encoded_stems = [encode_special_chars(path) for path in current_audio_stem]

            return {
                "soprano": encoded_stems[0],
                "alto": encoded_stems[1],
                "tenor": encoded_stems[2],
                "instrumental": encoded_stems[-1]
            }
        except Exception as e:
            print(f"Error resetting modifications: {e}")
            return {"error": str(e)}, 500
        
    def get_lyrics(self, song_id):
        """
        Retrieve or extract lyrics for a specified song ID.

        Parameters:
            song_id (str): Unique identifier of the song to retrieve lyrics for.

        Returns:
            dict: JSON response with lyrics text.
            tuple: Error message and HTTP status code if song is not found or extraction fails.
        """
        try:
            # Retrieve song details by song ID
            song_details = self.get_song_by_id(song_id)
            if not song_details:
                return {"error": "Song not found"}, 404

            # Get existing lyrics
            lyrics = song_details.get('lyrics')
            if lyrics:
                return {"lyrics": lyrics}

            # Extract lyrics from audio if not already present
            soprano_path = song_details["musical_parts"]["soprano_path"]
            lyrics = extract_lyrics(soprano_path)
            
            # Update the database with extracted lyrics
            self.update_song_by_id(song_id, {"lyrics": lyrics})

            return {"lyrics": lyrics}
        except Exception as e:
            print(f"Error getting lyrics: {e}")
            return {"error": str(e)}, 500
