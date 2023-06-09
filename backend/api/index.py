from flask import Flask, jsonify, request
from flask_cors import CORS
from .login import with_login
import os
from dotenv import load_dotenv
import sys
from .repository.pieces import get_pieces, get_pieces_id 
from .repository.neighbors import get_piece_neighbors

load_dotenv(".env.development" if os.environ.get('ENV', None) == 'dev' else ".env.production")
load_dotenv(".env")

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return 'Hello, World 4!'


@app.get('/api/pieces')
def pieces():
    return jsonify({ 
       "_links": {},
        "array": get_pieces()
    })



@app.get('/api/demoAuth')  # only for demostration purposes
@with_login
def demo_auth(user):
    print(user)
    return jsonify({ 
        "some": "data",
        "user": user
    })

@app.get('/api/pieces/<id>')
def pieces_id(id):
    args = request.args
    id=int(args.get("id"))
    data= get_pieces_id(id)
    return jsonify({ 
        "data": data
    })

@app.get('/api/pieces/<id>/neighbors')
def pieces_id_neighbors(id):
    args = request.args
    id=int(args.get("id"))
    size=int(args.get("size"))
    array_neighbors= get_piece_neighbors(id, size)
    return jsonify({ 
        "array": array_neighbors
    })