
# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi

# uri = "mongodb://dbmusic:tituz175@cluster0-shard-00-00.uw05m.mongodb.net:27017,cluster0-shard-00-01.uw05m.mongodb.net:27017,cluster0-shard-00-02.uw05m.mongodb.net:27017/?retryWrites=true&w=majority&appName=Cluster0"

# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))

# # Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)



# from pymongo import MongoClient

# # Replace the placeholder values with your actual credentials and cluster details
# username = "dbmusic"
# password = "tituz175"
# cluster_url = "cluster0-shard-00-00.uw05m.mongodb.net:27017,cluster0-shard-00-01.uw05m.mongodb.net:27017,cluster0-shard-00-02.uw05m.mongodb.net:27017"

# # Construct your connection string using mongodb:// instead of mongodb+srv://
# connection_string = f"mongodb://{username}:{password}@{cluster_url}/?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority"

# try:
#     # Create a MongoClient
#     client = MongoClient(connection_string)

#     # Test the connection by listing databases
#     databases = client.list_database_names()
#     print("Connected to MongoDB Atlas successfully!")
#     print("Databases:", databases)

# except Exception as e:
#     print(f"An error occurred: {e}")

from pymongo import MongoClient

client = MongoClient("mongodb+srv://dbmusic:tituz175@cluster0.uw05m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db=client['db1']
collection = db['youtube']

doc = {"name": "tobi", "city":"ibadan"}
inserted_document = collection.insert_one(doc)

print(f"Inserted Document ID: {inserted_document.inserted_id}")
client.close()
