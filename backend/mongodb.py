import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
print(f"MONGODB_URI : {MONGODB_URI}")

client = MongoClient(MONGODB_URI)

db = client['musicnalyzer']
collection = db['songs']

mydocument = {
    "title": "My First Song",
    "artist": "Example Artist",
    "album": "Example Album",
    "genre": "Example Genre",
    "paths": ["uploads/song1.mp3"],
    "duration": 300,
    "loudness": 5.0,
    "bpm": 120,
    "key": "C",
    "mode": "Major"
}

insert_doc = collection.insert_one(mydocument)

print(f"Inserted document ID: {insert_doc.inserted_id}")

client.close()
