#!/usr/bin/env python3

from flask import Flask, request
from dotenv import load_dotenv

from web import web, not_found_handler as web_404
from api import api, not_found_handler as api_404

load_dotenv()

app = Flask(__name__)
app.secret_key = 'e6187732c0ad5760606c2871be66d3edb9fc9abd09e56e42ef443845ef4ef3a1'

app.config.from_object('config.default')
app.config.from_envvar('SERVER_SETTINGS_FILE', silent=True)

app.register_blueprint(web)
app.register_blueprint(api)

@app.errorhandler(404)
def global_not_found_handler(e):
    if request.path.startswith("/api"):
        return api_404(e)
    else:
        return web_404(e)

if __name__ == '__main__':
    app.run()