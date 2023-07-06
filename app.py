#!/usr/bin/env python3

from random import Random
import datetime

from flask import Flask, render_template, send_from_directory, request

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

@app.route('/puntuaciones')
def puntuaciones():
    page = request.args.get('page', 1, type=int)
    rand = Random(page)
    scorelist = []
    for i in range(50):
        scorelist.append((
            f"usuario_{rand.randint(100, 999)}",
            '02/06/2023',
            rand.randrange(0, 500_000, 250),
            '00:10:00.000'
        ))
    return render_template('puntuaciones.html', scorelist=scorelist)

@app.route('/puntuacion')
def puntuacion():
    id = request.args.get('id', 0, type=int)
    rand = Random(id)
    
    finals = [
        'Daño por caída',
        'Alcanzó la salida',
        'Derrotado por enemigo',
        'Derrotado por jefe',
    ]
    
    scoredata = {
        'date': request.args.get('date', '01/06/2023', type=str) + " 01:01:01",
        'id': id,
        'user': request.args.get('user', 'usuario_0'),
        'seed': rand.randint(1, 999999),
        'version': 'v0.0.1',
        'score': request.args.get('score', '5000'),
        'time': request.args.get('time', '00:05:00.000'),
        'details': {
            'Tipo de final': rand.choice(finals),
            'Nivel': rand.randint(1, 30),
            'Dinero': rand.randrange(0, 5000, 50),
            'Enemigos derrotados': rand.randint(0, 150),
        },
        'treasures': set(rand.choices(k=rand.randint(1, 4), population=[
            'Disquete',
            'Tarjeta perforada',
            'Raspberry Pi',
            'Lata de aire comprimido',
            'Modem',
            'Calculadora'
        ]))
    }
    return render_template('puntuacion.html', score=scoredata)

@app.route('/usuarios')
def usuarios():
    page = request.args.get('page', 1, type=int)
    rand = Random(page)
    userlist = []
    for i in range(25):
        userlist.append(f"usuario_{rand.randint(100, 999)}")
    return render_template('usuarios.html', userlist=userlist)

@app.route('/usuario')
def usuario():
    name = request.args.get('name', 'me', type=str)
    rand = Random(name)
    
    runs = rand.randint(0, 300)
    wins_percent = rand.betavariate(2, 5)
    wins = int(runs * wins_percent)
    
    t = datetime.datetime.fromtimestamp(1687665600).strftime('%x')
    
    scores = [
        ('30/06/2023', rand.randrange(0, 500_000, 250), '0.0')
        for i in range(min(runs, 25))
    ]
    
    widest_score = len(str(max(scores, key=lambda s: len(str(s[1])))[1]))
    
    userdata = {
        'name': name,
        'join_date': t,
        'account_type': rand.choice(['Administrador', 'Usuario', 'Tester']),
        'followers': rand.randint(0, 100),
        'follows': rand.randint(0, 100),
        'runs': runs,
        'wins': wins,
        'scores': scores,
        'widest_score': widest_score,
    }

    return render_template('usuario.html', user=userdata)

@app.route('/<path:route>')
def route(route):
    return render_template(f"{route}.html")


if __name__ == '__main__':
    app.run()