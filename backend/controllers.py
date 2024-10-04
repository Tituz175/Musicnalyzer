from flask import jsonify
from models import SongModel

class SongController:
    def __init__(self, mongo):
        self.song_model = SongModel(mongo)

    def get_all_songs(self):
        songs = self.song_model.get_all_songs()
        return (songs)

    def insert_song(self, song_data):
        if self.song_model.insert_song(song_data):
            return jsonify({"status": "Document inserted successfully"}), 200
        else:
            return jsonify({"error": "Error inserting song"}), 500