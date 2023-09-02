from flask import Blueprint, request, jsonify

import core

api = Blueprint('api', __name__, url_prefix='/api')

def get_model():
    try:
        auth_header = request.headers['Authorization']
    except (KeyError, TypeError):
        token = None
    try:
        token_str, token = auth_header.split(" ", 1)
        assert(token_str == 'token')
        print(token)
        return core.Model(token)
    except core.RemovedSessionError as e:
        return core.Model()


@api.route('/v1/users')
def get_users():
    model = get_model()
    return jsonify(model.get_users())