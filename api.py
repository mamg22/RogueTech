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

"""
TODO: Function to generate base response bodies:

{
    "status": "ok" | "error",
    "result": Object (if "ok"),
    "details": { (if "error")
        "code": Integer,
        "message"
    }
}

Use a single function with branching

response(data, type)

or

ok(data), err(details)

"""

@api.route('/users')
def get_users():
    model = get_model()
    return jsonify(model.get_users())

@api.post('/login')
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    model = get_model()

    if user := model.login(username, password):
        return jsonify(user)
    else:
        return {"error": "Not ok"}, 400


@api.post('/create-account')
def create_account():
    data = request.get_json()
    username = data['username']
    password = data['password']
    pin = data['pin']

    model = get_model()

    if model.create_account(username, password, pin):
        return {"status": "ok"}
    else:
        return {"status": "failed"}

@api.post('/recovery')
def recovery():
    data = request.get_json()
    username = data['username']
    pin = data['pin']
    new_password = data['new_password']

    model = get_model()

    if model.recover_account(username, pin, new_password):
        return {"status": "ok"}
    else:
        return {"status": "failed"}


@api.patch('/user/<int:id>')
def update_user(id):
    data = request.get_json()

    model = get_model()

    if password := data.get("password"):
        model.change_password(password)
    if pin := data.get("pin"):
        model.change_pin(pin)
    
    return {}


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