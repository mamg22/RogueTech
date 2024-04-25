[Leer en inglés/Read in english](README.en.md)

# RogueTech

RogueTech es un juego RPG roguelike para navegadores, con funciones competitivas entre jugadores mediante calificaciones en línea.

## Características

* Jugabilidad estilo roguelike (Niveles aleatorios, derrota permanente).
* Animaciones, efectos de sonido, música de fondo, amplia variedad de enemigos y objetos.
* Capacidad de crear cuentas para subir puntuaciones y competir con otros usuarios.
* Seguir amigos y otros usuarios para encontrar sus puntuaciones más facilmente.
* Interfaz altamente dinámica, se verá bien tanto en escritorio como en móvil.
* Puede descargarse e instalarse como aplicación fácilmente.

## Requisitos

El programa requiere que las siguientes dependencias se encuentren instaladas y configuradas en el sistema:

* Python versión 3.10 o posterior.
* Base de datos MariaDB o MySQL.
* Node.js 18 o posterior.

## Instalación

### Configuración de la base de datos

Primero debe importarse la estructura de la base de datos al sistema gestor de bases de datos, lo cual se puede hacer a través de las herramientas provistas por éste u otras adicionales como phpMyAdmin. El primer paso será crear la base de datos que será usada, el nombre por defecto es “gamedb”; si elige otro nombre para la base de datos deberá especificarlo en la configuración (explicado en las secciones siguientes). Luego de crear la base de datos, deberá importar el archivo `schema.sql` en la base de datos.

### Instalar dependencias

Inicie una terminal o ventana de cmd en la carpeta de la aplicación y ejecute los siguiente comandos para instalar las dependencias requeridas la aplicación:

```
python -m pip install -r requirements.txt
npm install
```

El código del juego se encuentra dividido en múltiples archivos JavaScript en la carpeta `src`, que luego son compiladas junto con otras librerías en un único archivo completo que puede ser cargado por el navegador como `main-compiled.js`. Para compilar el código en un único archivo ejecute:

```
npm run build
```

### Configurar la aplicación

Al iniciar, la aplicación buscará configuración sobre cómo conectarse a la base de datos en la carpeta donde se está ejecutando. Buscará un archivo `.env` que contendrá el nombre de la base de datos, así como también otra información sobre la base de datos. Si no existe el archivo `.env`, el servidor usará los valores por defecto para una configuración común, como la que se muestra a continuación. El contenido de este archivo `.env` puede ser:

```
export DB_NAME=gamedb
export DB_USER=root
export DB_PASS=
export DB_HOST=localhost
```

Donde `DB_NAME` es el nombre de la base de datos, `DB_USER` es el nombre del usuario con el que nos conectaremos a la base de datos, `DB_PASS` es la contraseña del usuario de la base de datos, y `DB_HOST` es la dirección de la base de datos, normalmente es localhost.

Adicionalmente a las opciones de la base de datos y de manera opcional, puede configurar la opción `ENABLE_DEVMENU`, que activa o desactiva el menú de opciones para desarrollador disponible en el menú de pausa dentro del juego. Un valor de 1 (el valor por defecto) activa el menú y un valor de 0 desactiva el menú.

```
export ENABLE_DEVMENU=1
```


### Crear un usuario administrador

El sistema inicialmente no tendrá usuarios, por lo que deberá crear un usuario administrador inicial. Por motivos de seguridad, la creación de usuarios administradores está completamente separada de la que es ofrecida a través de la interfaz web, la cual sólo registrá usuarios de tipo regular. Para crear un nuevo usuario administrador, ejecute el siguiente comando:

```
python make-admin.py
```

El cual le preguntará por el nombre de usuario, contraseña y pin para el nuevo administrador; una vez ingresados los datos, el script intentará crear el administrador e indicará si la operación fue exitosa o si ha ocurrido algún error.

## Ejecución

### Iniciar la aplicación

Una vez instaladas las dependencias y configurado el entorno, la aplicación podrá iniciar correctamente. Para iniciarla, abra una terminal o cmd en la carpeta de la aplicación, donde deberá ejecutar el siguiente comando:

```
python -m flask run
```

Una vez iniciada, podrá abrir http://localhost:5000/ para hacer uso de la aplicación.

## Otros

### Compilar o modificar el juego

Para compilar o efectuar modificaciones en el código del juego (ubicado en la carpeta `src`), es necesario recompilar el código para formar un único archivo que incluye todas las dependencias. Para recompilar el código se usa el comando:

```
npm run build
```

O para el modo de compilación continua, que recompila el juego cada vez que se guarda un cambio, se usa el comando:

```
npm run watch
```

