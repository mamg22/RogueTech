#!/usr/bin/env bash

die() {
    echo "ERROR: $*" >&2
    exit 1
}

mysql() {
    command mysql --host="$DB_HOST" --password="$DB_PASS" --user="$DB_USER" "$@"
}

if ! [ "$DB_PASS" ]; then
    die "Database configuration variables not defined"
fi

while getopts t name; do
    case "$name" in
        (t)
            use_test="1"
            ;;
        (?)
            echo "Unknown option"
            exit 1
            ;;
    esac
done


mysql <<<"DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME" ||
    die "Failed dropping/creating"
echo "Dropped and created database '$DB_NAME'"

mysql --database="$DB_NAME" < schema.sql ||
    die "Failed loading schema"
echo "Loaded schema for database '$DB_NAME'"

if [ "$use_test" ]; then
    mysql -D "$DB_NAME" < test-data.sql ||
        die "Failed adding test data"
    echo "Loaded test data for database '$DB_NAME'"
fi