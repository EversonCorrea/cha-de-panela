import json
import os
from pymongo import MongoClient
from bson.objectid import ObjectId

# Conexão com o MongoDB Atlas
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("cha_de_panela")
collection = db.get_collection("presentes")

def handler(event, context):
    try:
        data = json.loads(event["body"])
        item_id = data.get("item_id")
        nome = data.get("nome")

        # Verifica se os dados necessários foram recebidos
        if not item_id or not nome:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "ID do item e nome são obrigatórios."})
            }
        
        # Converte o ID para um ObjectId que o MongoDB entende
        obj_id = ObjectId(item_id)
        
        # Encontra o item e o atualiza de forma segura
        # 'find_one_and_update' garante que apenas uma pessoa consiga "pegar" o item
        result = collection.find_one_and_update(
            {"_id": obj_id, "status": "disponivel"},  # Condição: item deve estar disponível
            {"$set": {"status": "escolhido", "escolhido_por": nome}}
        )

        if result:
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Presente escolhido com sucesso!"})
            }
        else:
            # Se 'result' for None, significa que o item já foi escolhido
            return {
                "statusCode": 409,
                "body": json.dumps({"message": "Este presente já foi escolhido por outra pessoa."})
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }