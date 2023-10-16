import datetime
from enum import Enum, IntEnum, auto
from http import HTTPStatus
import json
import traceback

from flask import Blueprint, request, jsonify, session

import core

api = Blueprint('api', __name__, url_prefix='/api/v1')

def get_model():
    try:
        token = None
        if request.authorization:
            token = request.authorization.token
        else:
            try:
                token = session['user_session']['token']
            except (KeyError, TypeError):
                token = None
        return core.Model(token)
    except core.RemovedSessionError as e:
        # TODO: Return an error
        return core.Model()

class Status(IntEnum):
    ok = HTTPStatus.OK.value
    created = HTTPStatus.CREATED.value
    no_content = HTTPStatus.NO_CONTENT.value

    bad_request = HTTPStatus.BAD_REQUEST.value
    error = bad_request
    unauthorized = HTTPStatus.UNAUTHORIZED.value
    forbidden = HTTPStatus.FORBIDDEN.value
    not_found = HTTPStatus.NOT_FOUND.value
    conflict = HTTPStatus.CONFLICT.value
    gone = HTTPStatus.GONE.value


    def is_ok(self):
        return self.value < 400

    def as_http_status(self):
        if 100 <= self.value < 600:
            return self.value
        elif self.value < 100:
            return HTTPStatus.OK.value
        else:
            return HTTPStatus.BAD_REQUEST.value

"""
{
    "status": "ok" | "error",
    "result": Any,
    "details": {
        "code": Integer,
        "message": String
    }
}
"""

def api_response(status: Status, data=None):
    status_type = "ok" if status.is_ok() else "error"
    return {
        "status": status_type,
        "details": {
            "code": status.value,
            "message": status.name
        },
        "result": data,
    }, status.as_http_status()

@api.route('/users')
def get_users():
    model = get_model()
    return api_response(Status.ok, model.get_users())

@api.post('/login')
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    model = get_model()

    if user := model.login(username, password):
        return api_response(Status.ok, user)
    else:
        return api_response(Status.not_found, "Invalid username or password")


@api.post('/create-account')
def create_account():
    data = request.get_json()
    username = data['username']
    password = data['password']
    pin = data['pin']

    model = get_model()

    if model.create_account(username, password, pin):
        return api_response(Status.created)
    else:
        return api_response(Status.conflict, "User already exists")

@api.post('/recovery')
def recovery():
    data = request.get_json()
    username = data['username']
    pin = data['pin']
    new_password = data['new_password']

    model = get_model()

    if model.recover_account(username, pin, new_password):
        return api_response(Status.ok)
    else:
        return api_response(Status.not_found)


@api.patch('/user')
def update_user():
    data = request.get_json()

    model = get_model()

    if password := data.get("password"):
        model.change_password(password)
    if pin := data.get("pin"):
        model.change_pin(pin)
    
    return api_response(Status.ok)


@api.post('/score')
def insert_score():
    data = request.get_json()

    model = get_model()

    date = datetime.datetime.fromisoformat(data['date']).astimezone()

    model.insert_score(
        data['seed'],
        data['version'],
        date,
        data['score'],
        data['time_ms'],
        data['success'],
        json.dumps(data['details'])
    )
    return api_response(Status.created)


@api.errorhandler(Exception)
def catch_all_handler(e):
    return api_response(Status.error, str(e) + "\n\n" + traceback.format_exc())

@api.errorhandler(404)
def not_found_handler(e):
    return api_response(Status.not_found, e.description)