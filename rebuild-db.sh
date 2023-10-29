#!/usr/bin/env bash

die() {
    echo "ERROR: $*" >&2
    exit 1
}

mysql() {
    command mysql --database="$DB_NAME" --host="$DB_HOST" --password="$DB_PASS" --user="$DB_USER""$@"
}

if [ -e ".env" ]; then
    source ".env"
fi

if ! [ "$DB_NAME" ]; then
    die "Database configuration variables not defined"
fi

while getopts dt name; do
    case "$name" in
        (t)
            use_test="1"
            ;;
        (d)
            do_drop="1"
            ;;
        (?)
            echo "Unknown option"
            exit 1
            ;;
    esac
done

if [ "$do_drop" ]; then
    mysql <<<"DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;" ||
        die "Failed dropping/creating"
    echo "Dropped and created database '$DB_NAME'"
fi

mysql < schema.sql ||
    die "Failed loading schema"
echo "Loaded schema for database '$DB_NAME'"

if [ "$use_test" ]; then
    mysql < test-data.sql ||
        die "Failed adding test data"
    echo "Loaded test data for database '$DB_NAME'"
fi