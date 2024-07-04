#!/usr/bin/env bash
set -eu

read -p "The entire database will be deleted! Are you sure? [y/N] " -r
test "${REPLY}" = "y" || {
    echo "Abort"
    exit
}

symfony console doctrine:database:drop --force  || {
    echo "could not drop database!"
    exit 1;
}

symfony console doctrine:database:create
symfony console doctrine:schema:create
symfony console doctrine:migrations:version --all --add --no-interaction
symfony console doctrine:schema:validate

read -p "Load fixtures? [y/N] " -r
test "${REPLY}" = "n" || {
    symfony console hautelook:fixtures:load --no-interaction
    exit
}
