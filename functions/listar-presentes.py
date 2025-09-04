import json
import os
from pymongo import MongoClient
from bson.json_util import dumps

# Conexão com o MongoDB Atlas
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("cha_de_panela")
collection = db.get_collection("presentes")

def handler(event, context):
    try:
        # Busca todos os presentes da coleção "presentes"
        # O dumps é necessário para converter o resultado do MongoDB para JSON
        presentes = list(collection.find({}))
        
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": dumps(presentes)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }