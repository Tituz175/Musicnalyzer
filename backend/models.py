from flask_pymongo import PyMongo
from bson import json_util
from flask import jsonify

class SongModel:
    def __init__(self, mongo):
        self.mongo = mongo

    def get_all_songs(self):
        songs_collection = self.mongo.db.songs
        songs = songs_collection.find()
        result = []
        for song in songs:
            song_id = str(song['_id'])
            del song['_id']
            song['_id'] = song_id
            result.append(song)
        return jsonify(result)
    
    def insert_song(self, song_data):
        try:
            self.mongo.db.songs.insert_one(song_data)
            return True
        except Exception as e:
            print(f"Error inserting song: {e}")
            return False

    def find_song(self, song_id, song_path=None):
        try:
            songs_collection = self.mongo.db.songs
            if song_path:
                song = songs_collection.find_one({'_id': song_id, 'paths': song_path})
            else:
                song = songs_collection.find_one({'_id': song_id})
            return json_util.dumps(song)
        except Exception as e:
            print(f"Error finding song: {e}")
            return None
