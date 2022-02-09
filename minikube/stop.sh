#!/bin/bash

# Connect docker to the runtime in minikube:
eval $(minikube docker-env)

docker-compose down --remove-orphans
