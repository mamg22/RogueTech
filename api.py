import datetime
import json

from flask import Blueprint, request, jsonify

import core

api = Blueprint('api', __name__, url_prefix='/api/v1')

def get_model():
    try:
        token = None
        if request.authorization:
            token = request.authorization.token
        return core.Model(token)
    except core.RemovedSessionError as e:
        # TODO: Return an error
        return core.Model()


@api.route('/users')
def get_users():
    model = get_model()
    return jsonify(model.get_users())

@api.post('/login')
def login():
    data = request.get_json()
    nombre = data['nombre']
    clave = data['clave']
    model = get_model()

    if user := model.login(nombre, clave):
        return jsonify(user)
    else:
        return {"error": "Not ok"}, 400


@api.post('/create-account')
def create_account():
    data = request.get_json()
    nombre = data['nombre']
    clave = data['clave']
    pin = data['pin']

    model = get_model()

    if model.create_account(nombre, clave, pin):
        return {"status": "ok"}
    else:
        return {"status": "failed"}

@api.post('/score')
def insert_score():
    data = request.get_json()

    model = get_model()

    model.insert_score(
        data['seed'],
        data['version'],
        datetime.datetime.fromisoformat(data['date']),
        data['score'],
        data['time_ms'],
        json.dumps(data['details'])
    )
    return {}, 200