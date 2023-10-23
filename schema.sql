CREATE OR REPLACE TABLE Perfil_usuario (
    nivel INTEGER PRIMARY KEY NOT NULL,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO Perfil_usuario VALUES
    (10, "Administrador"),
    (25, "Tester"),
    (30, "Regular")
;

CREATE OR REPLACE TABLE Usuario (
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(25) UNIQUE NOT NULL,
    clave VARCHAR(128) NOT NULL,
    pin VARCHAR(128) NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN NOT NULL DEFAULT FALSE,
    perfil INTEGER NOT NULL,
    CONSTRAINT fk_usuario_perfil
        FOREIGN KEY (perfil) REFERENCES Perfil_usuario(nivel)
);

CREATE OR REPLACE TABLE Usuario_sigue (
    id INTEGER NOT NULL,
    seguido INTEGER NOT NULL,
    CONSTRAINT Usuario_sigue_unique
        UNIQUE (id, seguido),
    CONSTRAINT Usuario_no_sigue_si_mismo
        CHECK (id != seguido),
    CONSTRAINT Usuario_sigue_id
        FOREIGN KEY (id) REFERENCES Usuario(id),
    CONSTRAINT Usuario_sigue_seguido
        FOREIGN KEY (seguido) REFERENCES Usuario(id)
);

CREATE OR REPLACE TABLE Calificacion (
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    semilla BIGINT NOT NULL,
    version_juego INTEGER NOT NULL,
    fecha DATETIME NOT NULL,
    puntuacion INTEGER UNSIGNED NOT NULL,
    tiempo_ms BIGINT UNSIGNED NOT NULL,
    exito BOOLEAN NOT NULL,
    detalles JSON NOT NULL,
    usuario INTEGER NOT NULL,
    CONSTRAINT fk_calificacion_usuario
        FOREIGN KEY (usuario) REFERENCES Usuario(id)
);

-- Poner inline el codigo para generar las columnas de tiempo
-- en formato HH:MM:SS.mmm, porque MySQL/MariaDB no permiten
-- usar funciones sencillas en columnas generadas :P
ALTER TABLE Calificacion ADD COLUMN tiempo VARCHAR(32) AS
(
    concat(
        concat_ws(':',
            lpad(
                tiempo_ms DIV (1000 * 60 * 60), 
                greatest(
                    length(tiempo_ms DIV (1000 * 60 * 60)), 
                    2
                ), '0'
            ),
            lpad(
                (tiempo_ms DIV (1000 * 60)) % 60, 2, '0'
            ),
            lpad(
                (tiempo_ms DIV 1000) % 60, 2, '0'
            )
        ),
        '.',
        lpad(
            tiempo_ms % 1000, 3, '0'
        )
    )
) PERSISTENT;

CREATE OR REPLACE TABLE Sesion (
    token VARCHAR(256) PRIMARY KEY NOT NULL,
    expira TIMESTAMP NOT NULL,
    usuario INTEGER NOT NULL,
    CONSTRAINT fk_sesion_usuario
        FOREIGN KEY (usuario) REFERENCES Usuario(id)
);

CREATE OR REPLACE VIEW Usuario_stats AS
    SELECT
        u.id as id_usuario,
        ifnull(sum(puntuacion), 0) as puntuacion_total,
        ifnull(max(puntuacion), 0) as puntuacion_maxima,
        count(c.id) as numero_puntuaciones
    FROM Usuario as u
    LEFT JOIN Calificacion as c
        ON c.usuario = u.id
    GROUP BY u.id
;

CREATE OR REPLACE VIEW Usuario_detalles AS
    SELECT
        u.id as id,
        u.nombre as nombre,
        u.fecha_registro as fecha_registro,
        u.eliminado as eliminado,
        pu.nivel as nivel_perfil,
        pu.nombre as nombre_perfil,
        us.puntuacion_total as puntuacion_total,
        us.puntuacion_maxima as puntuacion_maxima,
        us.numero_puntuaciones as numero_puntuaciones,
        (
            SELECT COUNT(id) 
            FROM Usuario_sigue us 
            WHERE us.id = u.id
        ) AS seguidos,
        (
            SELECT COUNT(id) 
            FROM Usuario_sigue us 
            WHERE us.seguido = u.id
        ) AS seguidores
    FROM Usuario AS u
    INNER JOIN Perfil_usuario AS pu
        ON u.perfil = pu.nivel
    INNER JOIN Usuario_stats AS us
        ON u.id = us.id_usuario
;

CREATE OR REPLACE VIEW Calificacion_lista AS
    SELECT
        c.id as id,
        semilla,
        version_juego,
        fecha, 
        puntuacion,
        tiempo_ms,
        tiempo,
        detalles,
        u.id as id_usuario,
        nombre as nombre_usuario
    FROM Calificacion AS c
    INNER JOIN Usuario AS u
        ON c.usuario = u.id
;

