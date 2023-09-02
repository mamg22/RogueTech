#!/usr/bin/env python3

from flask import Flask

from web import web
from api import api

app = Flask(__name__)
app.secret_key = 'e6187732c0ad5760606c2871be66d3edb9fc9abd09e56e42ef443845ef4ef3a1'

app.config.from_object('config.default')
app.config.from_envvar('SERVER_SETTINGS_FILE', silent=True)

app.register_blueprint(web)
app.register_blueprint(api)

if __name__ == '__main__':
    app.run()