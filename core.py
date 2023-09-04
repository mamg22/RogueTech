from random import Random
import datetime
import json
import time
from hashlib import blake2s
from secrets import token_urlsafe
from dataclasses import dataclass
from enum import IntEnum

import MySQLdb
import MySQLdb.cursors


_SORT_ORDERS = {
    'asc': 'ASC',
    'desc': 'DESC'
}

def get_pw_digest(password: str) -> str:
    pwhash = blake2s()
    pwhash.update(password.encode())
    return pwhash.hexdigest()

def format_ms(ms: int):
    millis = ms % 1000
    secs   = (ms // 1000) % 60
    mins   = (ms // (1000 * 60)) % 60
    hours  = (ms // (1000 * 60 * 60))
    
    return f"{hours:02d}:{mins:02d}:{secs:02d}.{millis:03d}"

def generate_token(userid: int):
    token_rand = token_urlsafe(128)
    current_time = int(datetime.datetime.now().timestamp())
    return f"{userid:012d};{current_time:012d};{token_rand}"

def get_token_expiration():
    now = datetime.datetime.now()
    duration = datetime.timedelta(days=90)
    return now + duration

class ModelError(Exception):
    pass

class NotAuthorizedError(ModelError):
    pass

class NoSessionError(ModelError):
    pass

class RemovedSessionError(ModelError):
    pass

class LastAdminRemoveError(ModelError):
    pass

class Model:
    @dataclass
    class Session:
        uid: int
        token: str
        expiration: datetime.datetime
        name: str
        level: int
        level_name: str
    
    USERS_PER_PAGE = 50
    SCORES_PER_PAGE = 50

    class Level(IntEnum):
        ADMIN = 10
        TESTER = 25
        REGULAR = 30
    
    def __init__(self, auth_token: str = None):
        self._db_connection: MySQLdb.connections.Connection | None = None
        self.session: self.Session | None = None
        if auth_token:
            if not self._load_session(auth_token):
                raise RemovedSessionError()
                
    def _get_cursor(self) -> MySQLdb.cursors.DictCursor:
        if self._db_connection is None:
            self._db_connection = MySQLdb.connect(
                host='localhost',
                database='gamedb',
                cursorclass=MySQLdb.cursors.DictCursor
            )
        return self._db_connection.cursor()

    
    def _load_session(self, auth_token: str):
        with self._get_cursor() as cursor:
            cursor.execute("""
                SELECT 
                    u.id as uid, 
                    u.nombre as name,
                    u.perfil as level,
                    p.nombre as level_name,
                    s.token as token,
                    s.expira as expiration
                FROM Usuario AS u
                INNER JOIN Perfil_usuario as p
                    ON u.perfil = p.nivel
                INNER JOIN Sesion as s
                    ON u.id = s.usuario
                WHERE s.token = %s
            """, (auth_token,))

            if session_data := cursor.fetchone():
                self.session = self.Session(**session_data)
                return self.session
            else:
                return None

    def get_session(self):
        if not self.session:
            raise NoSessionError()
        
        return self.session

    def _validate_sort_option(self, sort_str: str, valid_fields: list[str]):
        if sort_str.count('-') == 1:
            field, order = sort_str.split('-')
            if field in valid_fields and order in _SORT_ORDERS.keys():
                return True

        return False


    def get_scores(
            self, page: int = 1, user_filter: str = 'all', 
            score_sort: str = 'date-desc', custom_user_filter: str = None
        ) -> tuple[list[dict], int]:
        SORT_FIELDS = {
            'date': 'fecha',
            'user': 'nombre_usuario',
            'score': 'puntuacion',
            'time': 'tiempo_ms',
        }

        if page < 1:
            raise ValueError("Page cannot be 0 or negative")
        if user_filter not in ['all', 'following', 'followers', 'me', 'custom']:
            raise ValueError("Invalid user filter")
        if not self._validate_sort_option(score_sort, SORT_FIELDS.keys()):
            raise ValueError("Invalid sort option")
        if custom_user_filter is not None and not isinstance(custom_user_filter, list):
            raise TypeError("Invalid custom user filter list")


        sort_field, sort_order = score_sort.split('-')

        order_clause = f"ORDER BY {SORT_FIELDS[sort_field]} {_SORT_ORDERS[sort_order]}"

        query_arguments = []

        where_user_filter = 'WHERE '

        if user_filter == 'all':
            where_user_filter = ''
        elif user_filter == 'following':
            where_user_filter += 'u.id in (select seguido from Usuario_sigue where id = %s )'
            query_arguments.append(self.get_session().uid)
        elif user_filter == 'followers':
            where_user_filter += 'u.id in (select id from Usuario_sigue where seguido = %s )'
            query_arguments.append(self.get_session().uid)
        elif user_filter == 'me':
            where_user_filter += 'u.id = %s'
            query_arguments.append(self.get_session().uid)
        elif user_filter == 'custom':
            where_user_filter += 'u.nombre in %s'
            query_arguments.append(custom_user_filter or [None])

        limit_clause = f"LIMIT {self.SCORES_PER_PAGE} OFFSET {self.SCORES_PER_PAGE * (page - 1)}"

        with self._get_cursor() as cursor:
            cursor.execute(f"""
                SELECT count(c.id) as count
                FROM Calificacion AS c
                INNER JOIN Usuario AS u
                    ON c.usuario = u.id
                {where_user_filter}
            """, tuple(query_arguments))
            n_results = cursor.fetchone()['count']

            cursor.execute(f"""
                SELECT c.id as id, fecha, puntuacion, tiempo_ms, tiempo, u.id as id_usuario, u.nombre as nombre_usuario
                FROM Calificacion AS c
                INNER JOIN Usuario AS u
                    ON c.usuario = u.id
                {where_user_filter}
                {order_clause}
                {limit_clause}
            """, tuple(query_arguments))
            return cursor.fetchall(), n_results

    def get_score(self, id: int):
        with self._get_cursor() as cursor:
            cursor.execute("""
            SELECT c.id as id, semilla, version_juego, fecha, puntuacion,
                tiempo_ms, tiempo, detalles, u.id as id_usuario, nombre as nombre_usuario
            FROM Calificacion AS c
            INNER JOIN Usuario AS u
                ON c.usuario = u.id
            WHERE c.id = %s
            """, (id,))

            data = cursor.fetchone()
            data['detalles'] = json.loads(data['detalles'])

            return data

    def get_users(
            self, page: int = 1, user_sort: str = 'name-asc',
            user_filter: str = 'all', custom_user_filter: str = None
        ) -> tuple[list[dict], int]:
        SORT_FIELDS = {
            'name': 'nombre',
            'runs': 'numero_puntuaciones',
            'best_score': 'puntuacion_maxima',
            'total_score': 'puntuacion_total',
            'age': 'fecha_registro'
        }

        if page < 1:
            raise ValueError("Page cannot be 0 or negative")
        if user_filter not in ['all', 'following', 'followers', 'custom']:
            raise ValueError("Invalid user filter")
        if not self._validate_sort_option(user_sort, SORT_FIELDS.keys()):
            raise ValueError("Invalid sort option")
        if custom_user_filter is not None and not isinstance(custom_user_filter, list):
            raise TypeError("Invalid custom user filter list")


        sort_field, sort_order = user_sort.split('-')

        order_clause = f"ORDER BY {SORT_FIELDS[sort_field]} {_SORT_ORDERS[sort_order]}"

        query_arguments = []

        where_user_filter = 'WHERE '

        if user_filter == 'all':
            where_user_filter = ''
        elif user_filter == 'following':
            where_user_filter += 'id in (select seguido from Usuario_sigue where id = %s )'
            query_arguments.append(self.get_session().uid)
        elif user_filter == 'followers':
            where_user_filter += 'id in (select id from Usuario_sigue where seguido = %s )'
            query_arguments.append(self.get_session().uid)
        elif user_filter == 'custom':
            where_user_filter += 'u.nombre in %s'
            query_arguments.append(custom_user_filter or [None])

        limit_clause = f"LIMIT {self.USERS_PER_PAGE} OFFSET {self.USERS_PER_PAGE * (page - 1)}"
        
        with self._get_cursor() as cursor:
            cursor.execute(f"""
                SELECT count(id) as count FROM Usuario AS u
                {where_user_filter}
            """, tuple(query_arguments))
            n_results = cursor.fetchone()['count']

            cursor.execute(f"""
                SELECT u.id as id, u.nombre as nombre, perfil, fecha_registro, p.nombre as nombre_perfil,
                puntuacion_total, puntuacion_maxima, numero_puntuaciones
                FROM Usuario AS u
                INNER JOIN Usuario_stats AS us
                    ON u.id = us.id_usuario
                INNER JOIN Perfil_usuario AS p
                    ON u.perfil = p.nivel
                {where_user_filter}
                {order_clause}
                {limit_clause}
            """, tuple(query_arguments))
            return cursor.fetchall(), n_results

    def get_user(self, id: int):
        with self._get_cursor() as cursor:
            cursor.execute("""
                SELECT * FROM Usuario_detalles WHERE id = %s
            """, (id, ))
            return cursor.fetchone()

    def get_user_by_name(self, name: str):
        with self._get_cursor() as cursor:
            cursor.execute("""
                SELECT * FROM Usuario_detalles WHERE nombre = %s
            """, (name, ))
            return cursor.fetchone()
        
    def login(self, username: str, password: str):
        pwhash = get_pw_digest(password)

        with self._get_cursor() as cursor:
            cursor.execute("""
                SELECT id, u.nombre as nombre_usuario, nivel, p.nombre as perfil_usuario
                FROM Usuario AS u
                INNER JOIN Perfil_usuario AS p
                    ON u.perfil = p.nivel
                WHERE u.nombre = %s AND u.clave = %s
            """, (username, pwhash))

            user = cursor.fetchone()

            if user:
                token = generate_token(user['id'])
                expiration = get_token_expiration()
                cursor.execute("""
                    INSERT INTO Sesion(token, expira, usuario) VALUES
                    (%s, %s, %s)
                """, (token, expiration, user['id']))
                cursor.connection.commit()

                self._load_session(token)

                return self.session
            else:
                return None
    
    def create_account(self, username: str, password: str, pin: str, level: int = 30):
        pwhash = get_pw_digest(password)
        pinhash = get_pw_digest(pin)

        with self._get_cursor() as cursor:
            cursor.execute("""
                SELECT count(*) as u_exists
                FROM Usuario AS u
                WHERE u.nombre = %s
            """, (username,))

            exists = cursor.fetchone()['u_exists']

            if exists:
                return False
            else:
                cursor.execute("""
                    INSERT INTO Usuario(nombre, clave, pin, perfil)
                    VALUES (%s, %s, %s, %s)
                """, (username, pwhash, pinhash, level))
                cursor.connection.commit()
                return True
    
    def recover_account(self, username: str, pin: str, new_password: str):
        new_pwhash = get_pw_digest(new_password)
        pinhash = get_pw_digest(pin)

        with self._get_cursor() as cursor:
            cursor.execute("""
                SELECT id
                FROM Usuario
                WHERE nombre = %s AND pin = %s
            """, (username, pinhash))

            uid = cursor.fetchone()

            if uid:            
                cursor.execute("""
                    UPDATE Usuario
                    SET clave=%s
                    WHERE id = %s
                """, (new_pwhash, uid['id']))
                cursor.connection.commit()
                return True
            else:
                return False
    
    def change_password(self, new_password:str):
        new_pwhash = get_pw_digest(new_password)

        with self._get_cursor() as cursor:
            cursor.execute("""
                UPDATE Usuario
                SET clave=%s
                WHERE id = %s
            """, (new_pwhash, self.get_session().uid))
            cursor.connection.commit()
            return cursor.rowcount > 0

    def change_pin(self, new_pin:str):
        new_pinhash = get_pw_digest(new_pin)

        with self._get_cursor() as cursor:
            cursor.execute("""
                UPDATE Usuario
                SET pin=%s
                WHERE id = %s
            """, (new_pinhash, self.get_session().uid))
            cursor.connection.commit()
            return cursor.rowcount > 0

    
    def follow(self, target_id: int):
        with self._get_cursor() as cursor:
            uid = self.get_session().uid
            cursor.execute("""
                INSERT INTO Usuario_sigue(id, seguido)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE id=id
            """, (uid, target_id))
            cursor.connection.commit()
            return cursor.rowcount

    def unfollow(self, target_id: int):
        with self._get_cursor() as cursor:
            uid = self.get_session().uid
            cursor.execute("""
                DELETE FROM Usuario_sigue
                WHERE id = %s AND seguido = %s
            """, (uid, target_id))
            cursor.connection.commit()
            return cursor.rowcount
    
    def is_following(self, target_id: int):
        with self._get_cursor() as cursor:
            uid = self.get_session().uid
            cursor.execute("""
                SELECT count(*) as is_following
                FROM Usuario_sigue
                WHERE id = %s AND seguido = %s
            """, (uid, target_id))
            return cursor.fetchone()['is_following']
    
    def change_level(self, target_id: int, new_level: int) -> bool:
        if self.get_session().level > self.Level.ADMIN:
            raise NotAuthorizedError()
        
        with self._get_cursor() as cursor:
            if new_level != self.Level.ADMIN:
                # If updating this user's level causes to there being no
                # admins, halt the operation.
                cursor.execute("""
                    SELECT count(id) as admin_count
                    FROM Usuario
                    WHERE perfil = 10
                        AND id != %s
                """, (target_id,))
                admin_count = cursor.fetchone()['admin_count']

                if admin_count == 0:
                    raise LastAdminRemoveError()
            
            cursor.execute("""
                UPDATE Usuario
                SET perfil = %s
                WHERE id = %s
            """, (new_level, target_id))
            cursor.connection.commit()

            return cursor.rowcount > 0
    
    def insert_score(
        self, seed: int, version: int, date: datetime.datetime,
        score: int, time_ms: int, details: str
    ) -> int:
        with self._get_cursor() as cursor:
            cursor.execute("""
                INSERT INTO Calificacion(
                    semilla, version_juego, fecha, puntuacion,
                    tiempo_ms, detalles, usuario
                ) VALUES
                %s
                    
            """, ((seed, version, date, score, time_ms, details, self.get_session().uid),))
            row_id = cursor.connection.insert_id()
            cursor.connection.commit()

            return row_id



