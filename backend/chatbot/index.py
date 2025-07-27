from flask import Flask, request, jsonify
import json
from flask_cors import CORS
import os
from Agent import bot_response


app = Flask(__name__)
CORS(app, 
     origins='*',
     methods=['GET', 'POST', 'PUT', 'DELETE'],
     allow_headers=['Content-Type', 'Authorization'])
@app.route('/data', methods = ['POST'])
def handle_data():
    message = request.get_json()
    print(f"Received data: {message['inputs']}")
    response = bot_response(message['inputs'])
    return jsonify(response)

if __name__ == '__main__':
    port = os.getenv('CHATBOT_URL')
    app.run(host='0.0.0.0', port=port)

