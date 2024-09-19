# views/document_view.py
from flask import Flask, jsonify, request
from controllers.document_controller import DocumentController
from bson.json_util import dumps

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({"message": "Flask MVC API with MongoDB is running!"})

# Create a new document
@app.route('/api/create', methods=['POST'])
def create_document():
    data = request.json
    document_id = DocumentController.create_document(data)
    return jsonify({"message": "Document created", "id": document_id})

# Get all documents
@app.route('/api/documents', methods=['GET'])
def get_all_documents():
    documents = DocumentController.get_all_documents()
    return dumps(documents)

# Get a document by ID
@app.route('/api/document/<id>', methods=['GET'])
def get_document(id):
    document = DocumentController.get_document_by_id(id)
    if document:
        return dumps(document)
    else:
        return jsonify({"error": "Document not found"}), 404

# Update a document by ID
@app.route('/api/document/<id>', methods=['PUT'])
def update_document(id):
    data = request.json
    updated = DocumentController.update_document(id, data)
    if updated:
        return jsonify({"message": "Document updated"})
    else:
        return jsonify({"error": "Document not found or no changes made"}), 404

# Delete a document by ID
@app.route('/api/document/<id>', methods=['DELETE'])
def delete_document(id):
    deleted = DocumentController.delete_document(id)
    if deleted:
        return jsonify({"message": "Document deleted"})
    else:
        return jsonify({"error": "Document not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
