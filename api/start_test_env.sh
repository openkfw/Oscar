[[ -e .env ]] || cp .env.example .env

set -e
docker-compose -f docker-compose.test.yaml down && docker-compose -f docker-compose.test.yaml up --build -d
