# Start with development

Documentation on how to run application locally for development and use development specific features. Also some tips from the team actively developing this application.
If you are interested in contributing, please check also [CONTRIBUTING.md](https://github.com/openkfw/Oscar/blob/master/.github/CONTRIBUTING.md).

## Table of content

- [Prerequisites](#prerequisites)
  - [Yarn](#yarn)
  - [Docker](#docker)
  - [Docker Compose](#docker-compose)
  - [IDE Setup](#ide-setup)
- [Start app locally](#start-app)
- [Frontend development](#frontend-development)
  - [Create React App](#create-react-app)
  - [Running locally](#running-locally)
  - [OpenLayers](#openlayers)
- [Reverse Proxy](#reverse-proxy)
- [api](#api)
- [Database](#database)
  - [MongoDB](#mongodb)
  - [Mongo Express](#mongo-express)
  - [Mongoose](#mongoose)
- [Azure Blob Storage](#azure-blob-storage)
  - [Azurite](#azurite)
  - [Setup Microsoft Azure Storage Explorer](#setup-microsoft-azure-storage-explorer)
- [Run with authentication](#run-with-authentication)
- [Tests](#tests)
- [Pre-commit hook in GIT](#Pre-commit-hook-in-GIT)

## Prerequisites

- [Yarn](https://yarnpkg.com/package/yarn)
- [Docker](https://www.docker.com/) (version 17.06 or higher recommended)
- [Docker-Compose](https://docs.docker.com/compose/)
- IDE of your choice preferably [Visual Studio Code](https://code.visualstudio.com/)
- [Microsoft Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)

### Yarn

Fast, secure and reliable package manager.

#### How to install

Recommended way to install Yarn is by using NPM package manager, which comes bundled with Node.js, when you install it. You can run this command for both install and upgrade Yarn:

`npm install --global yarn`

There are also other ways to install Yarn. For more info check [Yarn documentation](https://classic.yarnpkg.com/en/docs/install/#mac-stable).

#### How to use

There are two ways to install necessary dependencies before starting the application. First is to run firstInstall.sh script. You can find more info about it in [Getting started](../getting-started/run-application.md) tutorial. Second is to run `yarn` in frontend and api folder and in any other service that includes package.json. Locally you can see dependencies in node_modules folder, that is ignored by git. Yarn follows [semantic versioning](https://semver.org/). Main files are:

- package.json - contains some properties describing the package, dependencies divided into groups etc..
- yarn.lock - contains exact versions of dependencies that were installed.

### Docker

is a tool designed to make it easier to create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and deploy it as one package. Check short [Docker overview](https://docs.docker.com/get-started/overview/) for more info.

#### Some useful Docker commands

- `docker ps` command shows running containers.
- `docker ps -a` command shows both running and stopped containers.
- `docker logs -f container_id` shows all logs from container and keeps following them.
- `docker system prune` removes all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes.
- `docker stop $(docker ps -aq)` stops all running containers.
- `docker rm $(docker ps -aq)` removes all containers.
- `docker rmi $(docker images -q)` removes all images.
- `docker volume prune` removes all unused local volumes.

For debugging purposes you can use `docker logs -f container_id`. Before this use command `docker ps` to see container ids of running containers and find the one from which you want to see the real-time logs. If you want to see just one-time printout from the log use `docker logs container_id` command instead.

When switching between two project that are both using Docker, there will be most likely problem with ports that are already allocated by running containers. Stop all running containers by `docker stop $(docker ps -aq)`.

The actions of creating and manipulating containers may result in many image layers and container-specific folders. Cleaning up these resources is important. Remove all containers with `docker rm $(docker ps -aq)` before you remove all images with `docker rmi $(docker images -q)`.

When switching between branches in the same project, there could be problems with starting the app. Using `docker system prune` can fix this problem in some cases.

After some time there are many unused local volumes, that take up a lot of disk space. Run `docker volume prune` to get rid of them once in a while.

### Docker Compose

is a tool for defining and running multi-container Docker applications. With Docker Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration. Using Compose is basically a three-step process:

1. Define your app’s environment with a Dockerfile
2. Define the services that make up your app in docker-compose.yml
3. Run `docker compose up` to start and run your app (that is done in ./start.sh script or in ./start_postgis.sh)

We have more Docker Compose files in the Oscar application.

In root:

- docker-compose.yml - main Compose file with multiple definitions
- docker-compose.manual-services.yml - Compose file for manual services like Initial data load
- docker-compose.auth.yml - for Proxy and OAuth Proxy container definition
- docker-compose.proxy.yml - for Proxy container definition

In services:

- docker-compose.test.yaml - for MongoDB container definition for testing purposes

### IDE Setup

We recommend to use VSCode as it's free IDE with many nice to have features and plenty of [extensions to install](https://marketplace.visualstudio.com/vscode). We created list of [recommended extensions](https://code.visualstudio.com/docs/editor/extension-marketplace#_workspace-recommended-extensions) in ./vscode/extensions.json, that you will be prompt to install when you open workspace in this IDE for the first time. You can also review the list with the Extensions: Show Recommended Extensions command. To download an extension directly from the Marketplace click on Extensions button in left sidebar, insert extension name in the search bar and click on Install button. Click on extension name to navigate to the details page.
You can also try to download extensions with similar functionality in different IDE.

List of recommended extensions:

- Azure Functions - used to create, debug, manage and deploy serverless apps directly from VS Code.
- ESLint - integrates [ESLint](https://eslint.org/) into VS Code.
- Debugger for Chrome - used to debug your JavaScript code in the Google Chrome browser, or other targets that support the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).
- Code Spell Checker - a basic spell checker that helps catch common spelling errors while keeping the number of false positives low.
- Docker - used to build, manage, and deploy containerized applications from Visual Studio Code. It also provides one-click debugging of Node.js, Python, and .NET Core inside a container.
- HTML CSS Support - HTML id and class attribute completion.
- IntelliSense for CSS class names in HTML - provides CSS class name completion for the HTML class attribute based on the definitions found in your workspace or external files referenced through the link element.
- markdownlint - includes a library of rules to encourage standards and consistency for Markdown files.
- Path Intellisense - plugin that autocompletes filenames.
- Prettier - Code formatter - integrates [Prettier](https://prettier.io/) into VS Code.
- YAML - provides comprehensive YAML Language support via the yaml-language-server, with built-in Kubernetes syntax support.
- Add jsdoc comments - adds simple jsdoc comments for the parameters of a selected function signature.
- Azure Storage - used to deploy static websites and Single Page Apps (SPAs) and browse Azure Blob Containers, File Shares, Tables, and Queues.

## Frontend development

Frontend consumes exposed Oscar api service and other APIs through [NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/). Frontend runs on [localhost on port 3000](http://localhost:3000). That is default ReactJS port. To change this port if needed just add for example PORT=3001 into package.json start script like this:

- "start": "PORT=3001 react-scripts start"

### Create React App

This project is based on the [create-react-app starter kit](https://github.com/facebookincubator/create-react-app) provided by the Facebook Incubator. It is a tool for easy building new single-page application in React. Under the hood it used Webpack, Babel, ESlint and other amazing projects. It needs just one build dependency: create-react-app and all underlying pieces work together seamlessly. The main part of the project configuration is encapsulated into the create-react-app and not accessible. If you need to access project configuration you can eject the project, which will then move the configuration into the project's package.json. Be aware that once you do this, you cannot go back to the previous state.

### Running locally

Locally the app runs in the Development Mode. In this mode performance is degraded but developer experience is best.

- Run `yarn` to install all the packages
- You can start only frontend with `yarn start` in ./frontend folder, but frontend is strongly data-based so for most functionality you need to run api also. This is done by simply starting all necessary services with `./start.sh` or `./start_postgis.sh` from root folder.

Open [localhost on port 3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes thanks to Hot reloading. You may also see any lint errors in the terminal. In Production mode code is transpiled to be compatible to older browser versions and the application is minimized, uglyfied and bundled into a single file for maximum performance. The production mode outputs static files which need to be hosted on a separate webserver.

- Run `yarn build` to create a production build

### Openlayers

[Openlayers](https://openlayers.org/) is open-source Javascript library used for displaying map data in the browser. It can display map tiles, vector data and markers loaded from any source. It can use any kind of geographic information.

## Reverse proxy

Reverse proxy is a gateway between clients and application servers. It forwards user requests to different application servers and returns response from them. On top of forwarding client communication it implements extra layer of security by adding security headers to forwarded requests and whitelists allowed http methods.
Reverse proxy is implemented by Nginx server [NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) containerized by Docker. Configuration file is stored in [nginx.conf](../frontend/proxy/nginx.conf). This config file is copied over to reverse proxy Docker container when application is being started. It also provides /health-check endpoint to check if container is running. Reverse proxy container configuration is in docker-compose.proxy.yml, container runs on [localhost on port 8888](http://localhost:8888). This is not the case when app is being [run with authentication](#Run-with-authentication).
Reverse proxy in our case forwards requests coming from Oscar UI to several locations:

- /api to [api](#api)
- /MAP to external map provider server
- /SEARCH to external map search
- /SATELLITE to external map server

## api

Is a Node.js micro service built in [Express.js](https://expressjs.com/). It consumes user requests from Oscar UI, communicates with [MongoDB](#MongoDB) database and [Azure Blob Storage](#Azure-Blob-Storage) and sends requested data from storage and database back to user. It is running in Docker container on [localhost on port 8080](http://localhost:8080). Container configuration can be found in docker-compose.yml. In container it is being run by [nodemon](https://github.com/remy/nodemon) which provides live reload. That means it restarts micro service after developer changes the code.
In [config.yml](../api/data/config/config.yml) user can find the definition of initial map coordinates and zoom settings as well as settings concerning Dashboard configuration.
Schema of endpoints can be found in [apiSchema.yml](../api/src/openapi/apiSchema.yml).

## Database

Database used in local development is determined by running either `start.sh` script for running evironment with MongoDB or `start_postgis.sh` for running with Postgis.

### MongoDB

For local development we are using [MongoDB](https://www.mongodb.com/). MongoDB is a general purpose distributed database that stores data in [JSON-like documents](https://docs.mongodb.com/manual/reference/bson-types/). Group of documents is called collection. MongoDb is running on localhost on port 27017. It is created and started as a Docker container when you use ./start.sh script to run the application. When you stop this script, database will be removed and all data deleted. For MongoDB administration we are using Mongo Express.

### Mongo Express

For easy access to database structure and quick editing of stored documents, we use web-based MongoDB [admin interface](https://github.com/mongo-express/mongo-express) that is running on [localhost on port 8081](http://localhost:8081) after you start the application with ./start.sh script. You can use it to connect to multiple databases, view, add and delete databases etc.

- Run `./start.sh` to start the app.
- In the admin you can see list of databases.
- Click on oscar and you can see some empty collections that were created.
- Run `./runinitialload.sh` to fill database with data.

- On the top you can see [Simple search](https://github.com/mongo-express/mongo-express/blob/master/README.md#search), that takes key & value provided by user and returns all matching documents. The projection in this case is set to {} so it returns all fields.
- Advanced search passes the query and projection objects into [MongoDB db.collection.find(query, projection)](https://docs.mongodb.com/manual/reference/method/db.collection.find/). Query object filters documents using query operators, while the projection object specify which fields to return in matching documents.

### Mongoose

[Mongoose](https://mongoosejs.com/) is an Object Data Modeling (ODM) Node.js library that provides schema based translation of javascript objects to MongoDB documents and vice versa. We use it to communicate with MongoDB in our services api and initial-data-load.

### Postgis

For local development we also use dockerized [Postgis](https://postgis.net/) which is based on [Postgres](https://www.postgresql.org/) with added GIS pluggins. Locally it runs on port 5432. It is created and started as a Docker container when you use ./start_postgis.sh script to run the application. For Postgis administration we are using PgAdmin.

### PgAdmin

For easy access to database structure and quick editing of stored tables, we use web-based PostgreSQL [admin interface](https://www.pgadmin.org/) that is running on [localhost on port 8184](http://localhost:8184) after you start the application with ./start_postgis.sh script. You can use it to connect to multiple databases, view, add and delete databases etc.

- Run `./start_postgis.sh` to start the app.
- Log in using `admin@test.com` and `adminPass` defined in environmental variables.
- In the admin you can see list of database servers.
- Click on Test and under it click on oscar.

## Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud. Blob Storage is optimized for storing massive amounts of unstructured data, such as text or binary data. For more info check [documentation](https://docs.microsoft.com/en-us/azure/storage/common/storage-introduction#blob-storage). We are using it to store files of various types. For local development we are using its emulator called Azurite.

### Azurite

[The Azurite](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite) is an open-source emulator that provides a free local environment for testing your Azure Blob and Queue Storage applications. Easiest way to work with Azurite is to install Microsoft Azure Storage Explorer.

### Setup Microsoft Azure Storage Explorer

[Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/) is a tool used to efficiently connect and manage your Azure storage service accounts and resources across subscriptions and organizations. You need to connect to Azure resource, in our case service in Storage account. Follow these steps:

1. Open Microsoft Azure Storage Explorer.
2. Click on Open Connect Dialog button in the left sidebar.
3. Connect to Storage account or service.
4. Use Connection string (Key or SAS) to connect
5. Copy AZURE_STORAGE_CONNECTION_STRING from ./.env file to Connection string field, but replace azurite in this string with 127.0.0.1
6. If you take a look at AZURE_STORAGE_CONNECTION_STRING you can see that Azurite will run on ports 10000-10001.
7. Click on Next and Connect in the next screen.

Now you have successfully connected to the service in Storage account.

1. In terminal start app with `./start.sh` or `./start_postgis.sh` a run `./runinitialload.sh` to have data in the Azurite.
2. Click on Toggle Explorer button in the left sidebar.
3. In Microsoft Azure Storage Explorer click on Refresh All.
4. Path to Blob Containers is Local & Attached -> Storage Accounts -> Display name.
5. In Blob Containers you can see layer-geo-data container with geojsons.

## Run with authentication

Oscar application provides also easy to implement authentication through [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/), which provides options to use various identity providers as OIDC, Azure and so on. This integration can be tested locally using `start_auth.sh` script. Oauth2-proxy runs in docker container with configuration in [docker-compose.auth.yml](../docker-compose.auth.yml) running on [localhost port 8888](http://localhost:8888) and after user is authenticated, it upstreams requests to reverse_proxy http port 80, which further forwards requests to respective servers. In this case Reverse Proxy doesn't have exposed port.
All important settings for oauth2-proxy can be found in their [documentation](https://oauth2-proxy.github.io/oauth2-proxy/docs/configuration/overview). There is also additional [index.html](../frontend/proxy/index.html) file that is copied over to Reverse Proxy which redirects user to Oscar UI on `http://localhost:3000` upon signing in instead of staying on `http://localhost:8888/oauth2/callback` callback page. To use also authentication middleware in `api` environment variable, AUTHORIZE_TOKEN_ATTRIBUTE has to be set to `true`.

## Tests

Unit test environment is separate for each micro service and is being run by `start_test_env.sh` script in respective folder. This runs testing MongoDB container on `port 27917` and Mongo Express on `port 8181` so it doesn't clash with database for local development. For unit tests the [Jest library](https://jestjs.io/) framework is used. Jest configuration can be found in `jest.config.js` in respective folders.
Steps to run tests for api locally when in root folder:

1. `cd api`
2. `./start_test_env.sh`
3. after test environment is running use one of several commands to run unit tests:

- `yarn test` runs all tests only once
- `yarn test:coverage` runs tests once and displays coverage
- `yarn test:watch` runs tests, watches for code changes and re-run tests after code change is detected

The test coverage can be found in respective folder in `coverage` folder, after running tests with `yarn test:coverage`.

### Jest

[Jest](https://jestjs.io/) is a JavaScript testing framework built by Facebook. It is primarily designed to work with React and React Native but also works with Babel, Node etc.. It is used for creating and running tests. It is offering broad functionality for example snapshot testing, interactive mode, coverage reports, notifications, mocks and assertions.

### SuperTest

[Package](https://yarnpkg.com/package/supertest) that is used to create assertions via client-side HTTP request library called [superagent](https://github.com/visionmedia/superagent). With SuperTest you can simply create HTTP requests and test expected response headers, status code etc..

## Pre-commit hook in GIT

For developers interested in contributing, we included pre-commit hook in root folder. After you run `yarn` in root folder, husky hook will check if commit message follows our conventions defined in [CONTRIBUTING.md](https://github.com/openkfw/Oscar/blob/master/.github/CONTRIBUTING.md) and abort commit with incorrect message.