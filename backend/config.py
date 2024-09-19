# config.py
from pymongo import MongoClient

def get_db():
    client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB URI
    db = client['mydatabase']  # Replace with your database name
    return db
