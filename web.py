import traceback

from flask import Blueprint, render_template, send_from_directory, request, flash, session, redirect, url_for, make_response

import core

web = Blueprint('web', __name__)

def is_htmx():
    return request.headers.get("HX-Request") == 'true'

def is_htmx_boost():
    return request.headers.get("HX-Boosted") == 'true'

def get_empty_response():
    if is_htmx():
        template = "fragments/empty.html"
    else:
        template = "index.html"

    response = make_response(render_template(template))
    response.headers['HX-Reswap'] = 'none'

    return response


@web.errorhandler(core.NoSessionError)
def no_session_handler(e):
    flash('No ha iniciado sesión, por favor inicie sesión e intentelo de nuevo', 'warning')
    return redirect('/')

@web.errorhandler(core.LastAdminRemoveError)
def last_admin_remove_handler(e):
    flash('Este usuario es el unico administrador del sistema, no sera posible cambiar su rol hasta que asigne otro administrador', 'error')
    return get_empty_response()

@web.errorhandler(core.NotAuthorizedError)
def not_authorized_handler(e):
    flash('Este usuario no esta autorizado para efectuar esta accion', 'error')
    return get_empty_response()


@web.errorhandler(Exception)
def exception_handler(e: Exception):
    return render_template("error.html", message=e, details=traceback.format_exc())

def not_found_handler(e):
    return render_template("error.html", message="No se ha podido encontrar esta página", details=e)


def get_model():
    try:
        token = session['user_session']['token']
    except (KeyError, TypeError):
        token = None
    try:
        model = core.Model(token)
        if token is not None:
            # Update the browser session if there's one
            session['user_session'] = model.get_session()
        return model
    except core.RemovedSessionError as e:
        flash('Su sesión se ha cerrado, por favor ingrese de nuevo', 'info')
        del session['user_session']
        redirect(url_for('web.login'))
        return core.Model()

@web.route('/')
def index():
    return render_template("index.html")

@web.route('/node_modules/<path:filename>')
def node_modules(filename):
    return send_from_directory(web.root_path + '/node_modules', filename)

@web.route('/favicon.ico')
def favicon():
    return '', 404

@web.route('/puntuaciones')
def puntuaciones():
    page = request.args.get('page', 1, type=int)
    
    if page < 1:
        flash("Página fuera de rango", 'error')
        page = 1

    user_filter = request.args.get('user_filter', 'all')
    score_sort = request.args.get('score_sort', 'date-desc')
    custom_user_filter = request.args.get('custom_user_filter', '')
    custom_user_filter_list = [s.strip() for s in custom_user_filter.split(',')]


    model = get_model()
    scores, score_count = model.get_scores(
        page=page,
        user_filter=user_filter,
        score_sort=score_sort,
        custom_user_filter=custom_user_filter_list
    )

    template = 'puntuaciones.html'

    if is_htmx() and not is_htmx_boost():
        template = 'fragments/scoretable.html'
    
    return render_template(template, scorelist=scores, score_count=score_count,
                           page=page, SCORES_PER_PAGE=model.SCORES_PER_PAGE)

@web.route('/puntuacion')
def puntuacion():
    id = request.args.get('id', 0, type=int)

    model = get_model()
    score_data = model.get_score(id)

    return render_template('puntuacion.html', score=score_data)

@web.route('/usuarios')
def usuarios():
    page = request.args.get('page', 1, type=int)

    if page < 1:
        flash("Página fuera de rango", 'error')
        page = 1

    user_filter = request.args.get('user_filter', 'all')
    user_sort = request.args.get('user_sort', 'name-asc')
    custom_user_filter = request.args.get('custom_user_filter', '')
    custom_user_filter_list = [ s.strip() for s in custom_user_filter.split(',')]
    
    model = get_model()
    users, user_count = model.get_users(
        page=page,
        user_filter=user_filter,
        user_sort=user_sort,
        custom_user_filter=custom_user_filter_list
    )

    template = 'usuarios.html'

    if is_htmx() and not is_htmx_boost():
        template = 'fragments/usertable.html'

    return render_template(template, userlist=users, user_count=user_count,
                           page=page, USERS_PER_PAGE=model.USERS_PER_PAGE)

@web.route('/usuario')
def usuario():
    name = request.args.get('name', type=str)

    model = get_model()    
    userdata = model.get_user_by_name(name)
    is_following = model.is_following(userdata['id'])
    return render_template('usuario.html', user=userdata, is_following=is_following)

@web.route('/iniciar-sesion', methods=['GET', 'POST'])
def login():
    print(session)
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        clave = request.form.get('clave')
        model = get_model()

        if user := model.login(nombre, clave):
            session['user_session'] = user
            flash(f"Bienvenido {user.name}")
            return redirect('/')
        else:
            flash("Nombre de usuario o constraseña incorrecto, por favor intentelo de nuevo", 'error')
            return render_template(f"iniciar-sesion.html")
    else:
        return render_template(f"iniciar-sesion.html")

@web.route('/crear-cuenta', methods=['GET', 'POST'])
def new_account():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        clave = request.form.get('clave')
        pin = request.form.get('pin')
        model = get_model()

        if model.create_account(nombre, clave, pin):
            user = model.login(nombre, clave)
            session['user_session'] = user
            flash(f"Cuenta creada exitosamente, bienvenido {user.name}", 'success')
            return redirect('/')
        else:
            flash("Nombre de usuario vacío", 'error')
            return render_template(f"crear-cuenta.html")
    else:
        return render_template(f"crear-cuenta.html")

@web.route('/recuperar-pass', methods=['GET', 'POST'])
def recovery():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        pin = request.form.get('pin')
        nueva_clave = request.form.get('clave')

        model = get_model()

        if model.recover_account(nombre, pin, nueva_clave):
            flash(f"Contraseña cambiada exitosamente, ahora podrá ingresar", 'success')
            return redirect('/iniciar-sesion')
        else:
            flash("Nombre de usuario o pin invalido", 'error')
            return render_template(f"recuperar-pass.html")
    else:
        return render_template(f"recuperar-pass.html")


@web.route('/cambiar-pass', methods=['GET', 'POST'])
def change_password():
    if request.method == 'POST':
        nueva_clave = request.form.get('clave')

        model = get_model()

        if model.change_password(nueva_clave):
            flash(f"Contraseña cambiada exitosamente", 'success')
            return redirect(url_for('web.my_profile'))
        else:
            flash("Error al cambiar la contraseña, intentelo de nuevo", 'error')
            return render_template(f"cambiar-pass.html")
    else:
        return render_template(f"cambiar-pass.html")

@web.route('/cambiar-pin', methods=['GET', 'POST'])
def change_pin():
    if request.method == 'POST':
        nuevo_pin = request.form.get('pin')

        model = get_model()

        if model.change_pin(nuevo_pin):
            flash(f"Pin cambiado exitosamente", 'success')
            return redirect(url_for('web.my_profile'))
        else:
            flash("Error al cambiar el pin, inténtelo de nuevo", 'error')
            return render_template(f"cambiar-pin.html")
    else:
        return render_template(f"cambiar-pin.html")



@web.route('/cerrar-sesion')
def logout():
    del session['user_session']
    return redirect('/')

@web.route('/mi-perfil')
def my_profile():
    name = get_model().get_session().name
    return redirect(f"/usuario?name={name}")

@web.route('/follow', methods=['POST', 'DELETE'])
def follow():
    target = request.args.get('id', type=int)
    
    model = get_model()
    if request.method == 'POST':
        model.follow(target)
    elif request.method == 'DELETE':
        model.unfollow(target)

    userdata = model.get_user(target)
    is_following = model.is_following(target)

    return render_template('fragments/followinfo.html', user=userdata, is_following=is_following)

@web.route('/set-user-role/<int:target_id>', methods=["PATCH"])
def set_user_role(target_id: int):
    new_role_id = request.form.get('role', type=int)

    model = get_model()

    model.change_level(target_id, new_role_id)
    userdata = model.get_user(target_id)

    flash("El rol del usuario ha sido cambiado exitosamente", 'success')

    return render_template('fragments/roleinfo.html', user=userdata)

