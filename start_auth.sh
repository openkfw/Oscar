#!/bin/bash
set -e
docker-compose down --remove-orphans && docker-compose -f docker-compose.yml -f docker-compose.auth.yml up --build -d

# frontend
cd ./frontend
yarn start
