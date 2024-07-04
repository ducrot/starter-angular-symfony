#!/usr/bin/env bash
set -eu


symfony console doctrine:migrations:diff  --env=dev
symfony console doctrine:migrations:migrate  --env=dev
symfony console doctrine:schema:validate  --env=dev
