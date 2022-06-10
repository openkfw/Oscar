# generate env file if not exist
[[ -e .env ]] || cp .env.example .env

#!/bin/bash
set -e
docker-compose down --remove-orphans && docker-compose -f docker-compose.yml -f docker-compose.mongo.yml -f docker-compose.proxy.yml up --build -d

# frontend
cd ./frontend
yarn start
