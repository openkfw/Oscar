# Getting started

## Prerequisites

- yarn (https://yarnpkg.com/getting-started/install)
- Docker (version 17.06 or higher recommended) (https://docker.com)
- Docker-Compose (https://docs.docker.com/compose)

The recommended option to get started with Oscar is to use the Docker-Compose.

The backend required environment variables are set in the .env file.
First of all, create env files in root, api and frontend folders with script firstInstall.sh
In root folder run:

```
./firstInstall.sh
```

This script will create env files with necessary env variables and also generate node modules in all three folders (root, api, frontend)

## Start the Application inside Docker

The backend services and MongoDB database can be run in docker with frontend starting locally by this helper script in the root folder

```
./start.sh
```

Use 'docker ps' to check on the running containers. You should see the following output:

```
CONTAINER ID   IMAGE                                     COMMAND                  CREATED          STATUS          PORTS                                                                   NAMES
29dda24a7819   oscar_api-service                         "docker-entrypoint.s…"   25 seconds ago   Up 20 seconds   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp                               oscar_api-service_1
64ce33bce3ea   nginx:alpine                              "/docker-entrypoint.…"   35 seconds ago   Up 19 seconds   0.0.0.0:8888->80/tcp, :::8888->80/tcp                                   oscar_reverse_proxy_1
637a3f2dc885   mcr.microsoft.com/azure-storage/azurite   "docker-entrypoint.s…"   35 seconds ago   Up 24 seconds   0.0.0.0:10000-10001->10000-10001/tcp, :::10000-10001->10000-10001/tcp   oscar_azurite_1
e5f8694a9ae6   mongo:3.6.18-xenial                       "docker-entrypoint.s…"   35 seconds ago   Up 28 seconds   0.0.0.0:27017->27017/tcp, :::27017->27017/tcp                           oscar_oscar-db-service_1
237e52634948   mongo-express                             "tini -- /docker-ent…"   35 seconds ago   Up 30 seconds   0.0.0.0:8081->8081/tcp, :::8081->8081/tcp                               oscar_mongo-express_1
```

After startup, there is a MongoDB explorer UI available here: http://localhost:8081/
Oscar application will start here: http://localhost:3000/

## Service

The application contains service, which are not part of automatic start script and can be run to load initial data. This service can be run by script in Docker after the application and database are set up.

To loads initial data into database run script

```
./runinitialload.sh
```
