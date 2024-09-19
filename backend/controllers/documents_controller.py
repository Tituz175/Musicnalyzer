# controllers/document_controller.py
from models.document_model import DocumentModel

class DocumentController:
    
    @staticmethod
    def create_document(data):
        return DocumentModel.create_document(data)

    @staticmethod
    def get_all_documents():
        return DocumentModel.get_all_documents()

    @staticmethod
    def get_document_by_id(document_id):
        return DocumentModel.get_document_by_id(document_id)

    @staticmethod
    def update_document(document_id, data):
        return DocumentModel.update_document(document_id, data)

    @staticmethod
    def delete_document(document_id):
        return DocumentModel.delete_document(document_id)
