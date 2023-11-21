#!/usr/bin/env python3

import sys

import core

def main():
    username = input("Nombre    > ")
    password = input("Contrasena> ")
    pin      = input("Pin       > ")

    try:
        model = core.Model()
        created = model.create_account(username, password, pin, model.Level.ADMIN.value)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

    if created:
        print(f"Creado administrador '{username}'")
    else:
        print(f"Error: Usuario '{username}' ya existe")

if __name__ == '__main__':
    main()