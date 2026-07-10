#!/bin/bash

ddev php bin/console doctrine:database:drop --force

ddev php bin/console doctrine:database:create

ddev php bin/console doctrine:migrations:migrate --no-interaction

