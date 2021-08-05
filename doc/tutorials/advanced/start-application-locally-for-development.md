# Start application locally for development

In this tutorial we will walk through setup of development environment, running application on local machine and running tests. For more explanations to the steps or tools used, please visit [development documentation page](../../development/development.md).
Some basic knowledge about command line and how to run shell scripts is expected.

## Clone repository

First of all, we need [git](https://git-scm.com/downloads) in order to clone Oscar repository to local folder.

`git clone https://github.com/openkfw/Oscar.git`

## Install prerequisites

All backend services can be run as docker containers with hot reload during development. For this install [Docker Desktop](https://www.docker.com/products/docker-desktop). On Linux OS, please install [Docker-Compose](https://docs.docker.com/compose/install/), too.

## Install dependencies and configure .env files

Application is written in javascript and typescript and each service has multiple dependencies and development dependencies in package.json file. This dependencies are not included in repository, they need to by downloaded with yarn.
You can either open each folder and manually run `yarn` or use our prepared script:

```
./firstInstall.sh
```

In addition to downloading all dependencies, this script will copy required environment variables from .env.example files. Example files provide variables for local development with provided Sample data and without authentication. If you are interested in authentication functionality, please check [development documentation](../../development/development.md#run-with-authentication)

## Start the application

For development purposes, we run backend services, including database and Azure Storage in Docker containers with `docker compose` and docker-compose.yml for definitions. Frontend created with 'create-react-app' has useful functionality if directly started on machine with `yarn start`, so start it separately.

This part is done in single start script:

```
./start.sh
```

First, docker will fetch required images, build new images with our code and settings and create containers. The images are stored for later use, so next time you run this script, it will be faster.
After all backend containers are started, it proceeds to frontend and opens the application directly in browser.

If you are not sure that it started correctly, use `docker ps` to check on the running containers. You should find this containers: oscar_api-service_1, oscar_reverse_proxy_1, oscar_azurite_1, oscar_oscar-db-service_1, oscar_mongo-express_1.

## Initial load with data

Application is running, but in order to work correctly, initial setup with data has to be run. Initial load service is prepared as another container in docker, also started with helper shell script:

```
./runinitialload.sh
```

The load is successfully finished, once there is following log in console: `Successfully uploaded all initial data.`. Data is loaded, but page in browser still requires reload to see the data directly in UI.

## View data in database

Among the services running in docker containers is also [Mongo Express](../../development/development.md#mongo-express) with admin UI. At the [localhost port 8081](http://localhost:8081). Here you can see 'oscar' database with multiple collections. This interface also allows modification directly on data in database.

## Run tests

Some of our services have also unit test, which can be run locally from the respective folder. Since they test also storing to database, they require one instance of mongodb at port 27917 with database 'oscar'. It can be created as docker container with

```
./start_test_env.sh
```

script from the respective folder.
All services have the same url for testing database, so you can start it only in one service and run tests from each. Also the database content is cleaned after each test, so they can be run independently or in shuffled order.

To run tests, open folder with service, if you can find the script mentioned above, run it.
Then run `yarn test`. For more options with generated coverage report, or watch mode, please consult [development documentation](../../development/development.md#tests)
