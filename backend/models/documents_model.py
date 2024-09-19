# models/document_model.py
from bson.objectid import ObjectId
from config import get_db

db = get_db()
collection = db['mycollection']  # Replace with your collection name

class DocumentModel:
    
    @staticmethod
    def create_document(data):
        result = collection.insert_one(data)
        return str(result.inserted_id)

    @staticmethod
    def get_all_documents():
        return list(collection.find())

    @staticmethod
    def get_document_by_id(document_id):
        return collection.find_one({"_id": ObjectId(document_id)})

    @staticmethod
    def update_document(document_id, data):
        result = collection.update_one({"_id": ObjectId(document_id)}, {"$set": data})
        return result.modified_count > 0

    @staticmethod
    def delete_document(document_id):
        result = collection.delete_one({"_id": ObjectId(document_id)})
        return result.deleted_count > 0
