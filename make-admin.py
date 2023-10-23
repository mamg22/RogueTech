#!/usr/bin/env python3

import sys

import core

def main():
    username = input("Username> ")
    password = input("Password> ")
    pin      = input("Pin     > ")

    try:
        model = core.Model()
        created = model.create_account(username, password, pin, model.Level.ADMIN.value)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

    if created:
        print(f"Created administrator '{username}'")
    else:
        print(f"User '{username}' already exists")

if __name__ == '__main__':
    main()