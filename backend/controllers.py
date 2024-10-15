import json
from flask import jsonify
from models import SongModel
from bson import ObjectId  # Ensure ObjectId is imported

class SongController:
    def __init__(self, mongo):
        self.song_model = SongModel(mongo)

    def get_all_songs(self):
        songs = self.song_model.get_all_songs()
        return songs

    def insert_song(self, song_data):
        # Insert the song into the database and retrieve the result
        result = self.song_model.insert_song(song_data)

        if result and hasattr(result, 'inserted_id'):
            # Return the MongoDB object ID of the inserted document
            return jsonify({
                "status": "Document inserted successfully",
                "inserted_id": str(result.inserted_id)  # Convert ObjectId to string for JSON serialization
            }), 200
        else:
            return jsonify({"error": "Error inserting song"}), 500

    def get_song_by_id(self, song_id):
        # Convert the string song_id to an ObjectId
        if not ObjectId.is_valid(song_id):  # Check if the song_id is a valid ObjectId
            return jsonify({"error": "Invalid song ID"}), 400
        
        song = self.song_model.find_song(ObjectId(song_id))  # Query by ObjectId

        # Check if song is a string
        if isinstance(song, str):
            try:
                # Convert the JSON string to a dictionary
                song = json.loads(song)
            except json.JSONDecodeError:
                return jsonify({"error": "Failed to decode song data"}), 500

        # Now, we assume song is a dictionary
        if isinstance(song, dict):
            # Create a new dictionary excluding the _id, song, and artist fields
            filtered_song = {
                "paths": song.get("paths"),
                "duration": song.get("duration"),
                "musical_key": song.get("musical_key"),
                "song_tempo": song.get("song_tempo"),
                "lyrics": song.get("lyrics"),
                "musical_parts": song.get("musical_parts")
            }
            return filtered_song  # Return the filtered song details
        else:
            return jsonify({"error": "Song not found"}), 404

    
    def update_song_by_id(self, song_id, song_obj):
        # Convert the string song_id to an ObjectId
        if not ObjectId.is_valid(song_id):  # Check if the song_id is a valid ObjectId
            return jsonify({"error": "Invalid song ID"}), 400
        
        # Update the song in the database and retrieve the result
        result = self.song_model.update_song(song_id, song_obj)

        if result and result.modified_count > 0:
            return jsonify({
                "status": "Document updated successfully",
                "modified_count": result.modified_count
            }), 200
        else:
            return jsonify({"error": "Error updating song"}), 500
