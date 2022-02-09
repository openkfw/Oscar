eval $(minikube docker-env)

set -e
docker-compose -f docker-compose.manual-services.yml up --build initial-data-load-service
