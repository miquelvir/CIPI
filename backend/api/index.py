from flask import Flask, jsonify, request
from flask_cors import CORS
from ._auth.login import with_login
import os
from dotenv import load_dotenv
from ._repository.pieces import get_pieces, get_pieces_id
from ._clients.pdf_difficulty_service import get_difficulty

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


@app.post('/api/pieces')
@with_login
def new_piece(user):
    print(f"{user.email} uploaded a file")
    score_file = request.files.get('score')
    difficulty = get_difficulty(score_file)
    return jsonify({ 
        "data": {
            "difficulty": difficulty,
            "pieces": get_pieces()  # todo limit results and get only neighbours
        }
    })


@app.post('/auth')
@with_login
def auth(user):
    return jsonify({
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
