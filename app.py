#!/usr/bin/env python3

from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/node_modules/<path:filename>')
def node_modules(filename):
    return send_from_directory(app.root_path + '/node_modules', filename)

@app.route('/favicon.ico')
def favicon():
    return '', 404

@app.route('/<path:route>')
def route(route):
    return render_template(f"{route}.html")


if __name__ == '__main__':
    app.run()