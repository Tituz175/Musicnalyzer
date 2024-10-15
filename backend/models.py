from flask_pymongo import PyMongo
from bson import json_util, ObjectId
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
            # Insert the document and return the result, which contains inserted_id
            result = self.mongo.db.songs.insert_one(song_data)
            return result  # Return the insert result object, which includes the inserted_id
        except Exception as e:
            print(f"Error inserting song: {e}")
            return False


    def find_song(self, song_id):
        try:
            songs_collection = self.mongo.db.songs
            # Convert the string song_id to an ObjectId to query MongoDB
            song = songs_collection.find_one({'_id': ObjectId(song_id)})
            if song:
                return json_util.dumps(song)
            else:
                return None
        except Exception as e:
            print(f"Error finding song: {e}")
            return None
    

    def update_song(self, song_id, song_obj):
        try:
            # Convert the string song_id to an ObjectId to query MongoDB
            result = self.mongo.db.songs.update_one({'_id': ObjectId(song_id)}, {'$set': song_obj})
            return result.modified_count
        except Exception as e:
            print(f"Error updating song: {e}")
            return False

