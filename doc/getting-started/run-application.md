# Getting started

## Prerequisites

For Windows user:
- Before cloning the repository, please make sure you are using the correct EOL (End of Line) setting. In the worst case, you will have to manually change each .js file from CRLF to LF.
- Solution for VSCode: 
    - Go to File/Preferences/Settings
    - Search for EOL
    - Please select "/n" under File:EOL
    - Set up your Git configuration to LF with the command in terminal:  
    ```
    git config --global core.autocrlf false
    ```

Repository cloned locally in folder. 

- yarn (https://yarnpkg.com/getting-started/install)
- Docker (version 17.06 or higher recommended) (https://docker.com)
- Docker-Compose (https://docs.docker.com/compose)

The recommended option to get started with Oscar is to use the Docker-Compose.

The backend required environment variables are set in the .env file.
First of all, create env files in root and frontend folders running:

```
./firstInstall.sh
```

This script will create env files with necessary env variables and also generate node modules in all three folders (api, frontend, initial-data-load)

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

## Start the Application inside Minikube on Mac

Prerequisities:
- install minikube, hyperkit docker kubectl docker-compose docker-credential-helper
```
brew install hyperkit docker kubectl minikube docker-compose docker-credential-helper
```

- optional before running minikube if you would like to provide more resources
```
minikube config set cpus 4
minikube config set memory 8g
```
- run minikube
```
minikube start --disk-size 80000mb
```
- from project root folder mount volume to minikube, bellow command will mount files from project to /minikube_volume folder inside minikube, this is where Docker will access the volumes, thus it needed to be updated in docker-compose files. Don't close this window or else the volume will be unmounted
```
minikube mount ./:/minikube_volume
```

Move your .env file to this folder, or it will be created on firs run of bellow script.
The backend services and MongoDB database can be run in docker with frontend starting locally by this helper script in the `minikube` folder.
Run the script bellow in new terminal tab

```
cd ./minikube
./start.sh
```

It will connect docker to the runtime in minikube and export minikube ip as env variable so it can be used by React proxy.

After startup, there is a MongoDB explorer UI available by running
```
./mongo_express_ui.sh
```
or by running command
```
minikube ip
```
and pasting provided ip in browser with port 8081

- before running other services like initial-data-load in another terminal, docker needs to be connected to minikube by running
```
eval $(minikube docker-env)
```

- if React frontend will be started separately from `./start.sh` script minikube ip needs to be exported in that terminal window before running `yarn start`
```
export API_IP=$(minikube ip)
cd ../frontend
yarn start
```

- Application containers can be stoped and removed by running
```
./stop.sh
```

- Whole minikube cluster can be destroyed by
```
minikube delete

## Unit testing services with minikube
1. after starting app with `start.sh` in minikube folder
2. open directory of service you want to test i.e. `api`
3. run commands `eval $(minikube docker-env)` to connect to docker-env in minikube and `export MONGO_URI=mongodb://$(minikube ip):27017/testDb` to create new mongoDB in already running container
4. run `yarn test` or `yarn test:coverage` or `yarn test:watch`

## Service

The application contains service, which are not part of automatic start script and can be run to load initial data. This service can be run by script in Docker after the application and database are set up.

To loads initial data into database run script

```
./runinitialload.sh
```
