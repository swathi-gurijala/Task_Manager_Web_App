from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["taskmanager"] # default DB from URI

# Collections
users_col = db["users"]
tasks_col = db["tasks"]
