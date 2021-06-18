export COUNTRY=Sample
export UPLOAD_DATA_TYPES=mapLayers,attributes
export NEW_STORAGE_CONTAINERS=layer-geo-data,raw-data
docker-compose -f docker-compose.manual-services.yml up --build initial-data-load-service
