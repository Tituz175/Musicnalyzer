"""
SongModel module for managing song records in a MongoDB database.

Classes:
    - SongModel: Provides database interaction methods for song documents, including
      retrieval by ID or name, insertion, and updating of song metadata.

Dependencies:
    - bson.ObjectId: MongoDB ObjectId type for identifying records.
    - bson.json_util: Utility for converting MongoDB BSON to JSON.
"""

from bson import ObjectId, json_util

class SongModel:
    """
    Model class for interacting with the MongoDB 'songs' collection, providing
    methods for retrieving, inserting, and updating song records.

    Attributes:
        mongo: MongoDB client instance for database operations.
    """

    def __init__(self, mongo):
        """
        Initialize the SongModel with a MongoDB client.

        Parameters:
            mongo: MongoDB client instance for accessing the songs collection.
        """
        self.mongo = mongo

    def find_song_by_name(self, song_name):
        """
        Retrieve a song document by its name.

        Parameters:
            song_name (str): Name of the song to retrieve.

        Returns:
            dict: Song document if found, or None if no song matches the name.
        """
        print(f"Searching for song: {song_name}")
        return self.mongo.db.songs.find_one({"song": song_name})

    def find_song(self, song_id):
        """
        Retrieve a song document by its unique ID.

        Parameters:
            song_id (str): String representation of the MongoDB ObjectId for the song.

        Returns:
            str: JSON string of the song document if found.
            None: If the song is not found or an error occurs.
        """
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

    def insert_song(self, song_data):
        """
        Insert a new song document into the database.

        Parameters:
            song_data (dict): Dictionary containing song metadata and audio paths.

        Returns:
            InsertOneResult: Result object containing the ID of the inserted document.
        """
        return self.mongo.db.songs.insert_one(song_data)

    def update_song(self, song_id, song_data):
        """
        Update an existing song document by its ID with new data.

        Parameters:
            song_id (ObjectId): MongoDB ObjectId of the song to update.
            song_data (dict): Dictionary of fields and values to update in the song document.

        Returns:
            UpdateResult: Result object indicating the outcome of the update operation.
        """
        try:
            object_id = ObjectId(song_id)  # Ensure ID is in ObjectId format
        except Exception:
            return {"error": "Invalid song ID format"}

        result = self.mongo.db.songs.update_one({"_id": object_id}, {"$set": song_data})

        if result.matched_count == 0:
            return {"error": "Song not found"}
        if result.modified_count == 0:
            return {"message": "No changes made, lyrics might be the same"}

        return {"message": "Lyrics updated successfully"}
