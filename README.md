[Leer en español/Read in spanish](README.es.md)

# RogueTech

RogueTech is a RPG roguelike game for browsers, with online competitive functionality between players via online leaderboards.

## Features

* Roguelike gameplay (Random levels, permadeath).
* Animations, sound effects, background music, wide variety of enemies and items.
* Can create accounts for submitting scores and competing with other users.
* Follow friend and other users to find their scores easily.
* Highly dynamic interface, will look good on desktop as well as on mobile.
* Can be easily downloaded and installed as an app.

## Screenshots

| Landing page | Game |
|-|-|
| ![Landing page](https://github.com/mamg22/RogueTech/assets/45301823/d309f964-3a44-4048-be37-a5de3e4c3b28) | ![In-game screen](https://github.com/mamg22/RogueTech/assets/45301823/eb2a9592-2f42-4d2d-b04e-749711f6c072) |
| Scores page | Responsive game UI |
| ![Score listing page](https://github.com/mamg22/RogueTech/assets/45301823/f01724f3-663e-4c6e-a1c4-8221e062ac70) | ![Responsive game interface](https://github.com/mamg22/RogueTech/assets/45301823/c2f8e931-caa8-4d88-94c1-29a415e587f7) |


## Requirements

The program requires the following dependencies to be installed and configured in the system:

* Python 3.10 or newer.
* MariaDB or MySQL database.
* Node.js 18 or newer.

## Instalation

### Database configuration

The database structure first has to be imported to the DBMS, which can be done using the tools provided by it or additional tools such as phpMyAdmin. The first step is to create the database to be used, the default database name is "gamedb"; if you choose another name for the database, you will need to specify it in the configuration (explained in the following sections). After creating the database, you need to import the `schema.sql` file into it.

### Installing dependencies

Start a terminal or cmd window running in the application's directory and run the following commands to install the dependencies required by the application:

```
python -m pip install -r requirements.txt
npm install
```

The game's code is divided into multiple JavaScript files in the `src` directory, which are later compiled along with other libraries into a single complete file that can be loaded by the browser as `main-compiled.js`. To compile the game source code run:

```
npm run build
```

### Configuring the application

At startup, the program will search settings for how to connect to the database in the directory where it is executing. It will search for a `.env` file that will contain the database name, as well as other information regarding the database. If the `.env` file doesn't exist, the server will use the default values as seen below. The `.env` file contents can be:

```
export DB_NAME=gamedb
export DB_USER=root
export DB_PASS=
export DB_HOST=localhost
```

Where `DB_NAME` is the database name, `DB_USER` is the username used to connect to the database, `DB_PASS` is the database user's password, and `DB_HOST` is the address to connect to the database, usually being `localhost`.

Additionally to the database options, the optional `ENABLE_DEVMENU` can be configured to enable or disable the developer settings available in the pause menu inside the game. A value of 1 (the default) activates the menu, and a value of 0 disables it.

```
export ENABLE_DEVMENU=1
```

### Creating an administrator user

Initially, the system will have no users, so you should create an initial administrator user. For security reasons, the creation of admin users is completely separated from the one offered in the web interface, which will only register regular users. To create a new admin user, execute the follwing command:

```
python make-admin.py
```

It will ask for the username, password and security pin for the new administrator; once the information is provided, the script will try to create the administrator and indicate the success of the operation or any errors that may happen.

## Executing

### Starting the application

Once the dependencies have been installed and the environment configured, the application can start correctly. To run it, start a terminal or cmd window in the application's directory, and run the following command:

```
python -m flask run
```

Once it starts, you will be able to open http://localhost:5000/ to begin using the application.

## Other

### Compile or modify the game

To compile or modify the game's code (in the `src` directory), it is required to recompile the the code to create a bundled file including all dependencies. To recompile use the command:

```
npm run build
```

Or for the continuous compilation mode, recompiling the game every time a change is saved, use:

```
npm run watch
```
