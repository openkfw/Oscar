#!/bin/bash

envsubst '$$AZURE_MAPS_CONNECTION_STRING,$$HERE_MAPS_CONNECTION_STRING' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec "$@"

if [[ -z ${ENABLE_SOURCE_MAPS} ]]; then
  rm /usr/share/nginx/html/static/*/*.map
fi

nginx -g 'daemon off;'