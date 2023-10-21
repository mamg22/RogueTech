#!/usr/bin/env bash

die() {
    echo "ERROR: $*" >&2
    exit 1
}

db_name="gamedb"

while getopts n:t name; do
    case "$name" in
        (n)
            db_name="$OPTARG"
            ;;
        (t)
            use_test="1"
            ;;
        (?)
            echo "Unknown option"
            exit 1
            ;;
    esac
done


mysql <<<"DROP DATABASE IF EXISTS $db_name; CREATE DATABASE $db_name" || die "Failed dropping/creating"

echo "Dropped and created database '$db_name'"

mysql -D "${db_name}" < schema.sql ||die "Failed loading schema"
echo "Loaded schema for database '$db_name'"

if [ "$use_test" ]; then
    mysql -D "${db_name}" < test-data.sql || die "Failed adding test data"
    echo "Loaded test data for database '$db_name'"
fi