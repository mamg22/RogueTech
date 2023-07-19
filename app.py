#!/usr/bin/env python3

from random import Random
import datetime
import json
import time

from flask import Flask, render_template, send_from_directory, request, flash, session, redirect

app = Flask(__name__)
app.secret_key = 'e6187732c0ad5760606c2871be66d3edb9fc9abd09e56e42ef443845ef4ef3a1'

@app.route('/s')
def s():
    ses = request.args.get('s')
    if ses == 'null':
        session["s"] = None
    else:
        session["s"] = ses
    return redirect('/')
        

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
    
    if page < 1 or page > 5:
        flash("Página fuera de rango", 'error')
        page = 1

    user_filter = request.args.get('user_filter', 'all')
    score_sort = request.args.get('score_sort', 'id')
    rand = Random(page)
    scorelist = []

    if user_filter == 'following':
        filtr = lambda _: rand.random() > .8
    elif user_filter == 'me':
        filtr = lambda _: rand.random() > .5
    else:
        filtr = lambda _: True
        
    for i in range(50):
        if user_filter == 'custom':
            names = request.args.get('custom_user_filter')
            namelist = [name.strip() for name in names.split(',') if len(name.strip()) > 0]
            if len(namelist) == 0:
                break
            scorelist.append((
                rand.choice(namelist),
                '02/06/2023',
                rand.randrange(0, 500_000, 250),
                '00:10:00.000'
            ))
        else:
            scorelist.append((
                session.get('username') if user_filter == 'me' else f"usuario_{rand.randint(100, 999)}",
                '02/06/2023',
                rand.randrange(0, 500_000, 250),
                '00:10:00.000'
            ))

    def sorter(mode):
        n = -1
        if mode == "user":
            n = 0
        elif mode == "score":
            n = 2
        else:
            n = 1
        def s(x):
            return x[n]
        
        return s
        
    scorelist = [x for x in scorelist if filtr(x)]
    scorelist.sort(key=sorter(score_sort))
    if score_sort == "score":
        scorelist.reverse()

    if request.headers.get("HX-Request") and not request.headers.get("HX-Boosted") == 'true':
        return render_template('fragments/scoretable.html', scorelist=scorelist)
    
    return render_template('puntuaciones.html', 
                           scorelist=scorelist)

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

    if page < 1 or page > 5:
        flash("Página fuera de rango", 'error')
        page = 1

    if request.args.get('user_filter') == 'custom':
        names = request.args.get('custom_user_filter')
        namelist = [name.strip() for name in names.split(',') if len(name.strip()) > 0]
        namelist = list(set(namelist))
        for i, name in enumerate(namelist):
            user_scores = [
                rand.randrange(0, 500_000, 250) for x in range(rand.randint(1, 15))
            ]
            userlist.append({
                'id': (page - 1) * 25 + i,
                'name': name,
                'best_score': max(user_scores),
                'total_score': sum(user_scores)
            })
    else:
        for i in range(25):
            user_scores = [
                rand.randrange(0, 500_000, 250) for x in range(rand.randint(1, 15))
            ]
            userlist.append({
                'id': (page - 1) * 25 + i + 1,
                'name': f"usuario_{rand.randint(100, 999)}",
                'best_score': max(user_scores),
                'total_score': sum(user_scores)
            })
            
    sort = request.args.get('user_sort', 'name')

    userlist.sort(key=lambda x: x[sort], reverse=(sort != 'name'))
    
    if request.headers.get("HX-Request") and not request.headers.get("HX-Boosted") == 'true':
        return render_template('fragments/usertable.html', userlist=userlist)

    return render_template('usuarios.html', userlist=userlist)

@app.route('/usuario')
def usuario():
    name = request.args.get('name', 'me', type=str)
    rand = Random(name)
    
    runs = rand.randint(0, 300)
    wins_percent = rand.betavariate(2, 5)
    wins = int(runs * wins_percent)
    
    t = datetime.datetime.fromtimestamp(1687665600).strftime('%x')
    
    userdata = {
        'name': name,
        'join_date': t,
        'account_type': rand.choice(['Administrador', 'Usuario', 'Tester']),
        'followers': rand.randint(0, 100),
        'follows': rand.randint(0, 100),
        'runs': runs,
        'wins': wins,
    }

    return render_template('usuario.html', user=userdata)

@app.route('/iniciar-sesion', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if user := request.form.get('nombre'):
            session['active'] = True
            session['username'] = user
            flash(f"Bienvenido {user}")
            return redirect('/')
        else:
            flash("Nombre de usuario vacío", 'error')
            return render_template(f"iniciar-sesion.html")
    else:
        return render_template(f"iniciar-sesion.html")

@app.route('/crear-cuenta', methods=['GET', 'POST'])
def new_account():
    if request.method == 'POST':
        if user := request.form.get('nombre'):
            session['active'] = True
            session['username'] = user
            flash(f"Cuenta creada exitosamente, bienvenido {user}", 'success')
            return redirect('/')
        else:
            flash("Nombre de usuario vacío", 'error')
            return render_template(f"crear-cuenta.html")
    else:
        return render_template(f"crear-cuenta.html")

@app.route('/recuperar-pass', methods=['GET', 'POST'])
def recovery():
    if request.method == 'POST':
        if user := request.form.get('nombre'):
            session['active'] = True
            session['username'] = user
            flash(f"Contraseña cambiada exitosamente, bienvenido {user}", 'success')
            return redirect('/')
        else:
            flash("Nombre de usuario vacío", 'error')
            return render_template(f"recuperar-pass.html")
    else:
        return render_template(f"recuperar-pass.html")

@app.route('/cerrar-sesion')
def logout():
    session.clear()
    return redirect('/')

@app.route('/<path:route>')
def route(route):
    return render_template(f"{route}.html")


if __name__ == '__main__':
    app.run()