import json
import os
from pymongo import MongoClient

# Conexão com o MongoDB Atlas
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("cha_de_panela") # Nome do seu banco de dados
collection = db.get_collection("convidados") # Nome da sua coleção

def handler(event, context):
    try:
        # A API Gateway envia os dados do formulário como um body
        data = json.loads(event["body"])
        nome = data["nome"]

        convidado = {
            "nome": nome,
            "confirmado": True
        }

        collection.insert_one(convidado)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Presença confirmada com sucesso!"})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }