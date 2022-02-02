#!/bin/bash

# generate env file if not exist
[[ -e .env ]] || cp .env.example .env

# Connect docker to the runtime in minikube:
eval $(minikube docker-env)

# export IP of minikube so React can setup correct proxy
export API_IP=$(minikube ip)

set -e
docker-compose down --remove-orphans && docker-compose -f docker-compose.yml -f docker-compose.proxy.yml up --build -d

# frontend
cd ../frontend
yarn start
