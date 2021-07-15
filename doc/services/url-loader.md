# URL LOADER

## Environment Variables

| Env Variable                       | Required | Default Value                                                      | Description                                                                                                                                                                                                                                                                                                      |
| ---------------------------------- | -------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NODE_ENV                           | no       | development                                                        | This environment variable is used to state in our case whether a particular environment is development, production, test or provision environment. Express uses it to alter its own default behavior. For example a common use-case is running additional debugging or logging code in a development environment. |
| PORT                               | no       | 8080                                                               | The port on which the service is running.                                                                                                                                                                                                                                                                        |
| LOG_LABEL                          | no       | oscar-url-loader-service                                          | Title of the logs that you can see in the terminal when you run the service.                                                                                                                                                                                                                                     |
| AZURE_STORAGE_CONNECTION_STRING    | yes      | -                                                                  |  Connection string for Azure Storage (in cloud or Azurite locally).                                                                                                                                                                                                                              |
| AZURE_STORAGE_DATA_CONTAINER_NAME  | yes       | raw-data                                                           | Name of the Blob Container in Azure Storage to which raw data is stored.                                                                                                                                                                                                                           |
| MONGO_URI                          | yes      | - | URI with port on which the MongoDB is running. In the development environment it runs on port 27917 and in the testing environment on port 27017.                                                                                                       |
| USERNAME                            | no      | -                                                                 | Login credential username that is used for API authentication.                                                                                                                                                                                                                                      |
| PASSWORD             | no       | -                                                                 | Login credential password that is used for API authentication.                                                                                                                                                                                                                                                                   |
| URL_FILE                 | no       | -                                                                 | Name of configuration yaml file with requests to the API.    |
| ONLY_SOURCE_NAMES                 | no       | -                                                                 | List of sources (APIs) names separated by comma. |
| EXCEPT_SOURCE_NAMES                 | no       | -                                                                 | List of excepted sources (APIs) names separated by comma. |
| URL_LOAD_BOTTLENECK_TIME_LIMIT                 | no       | -                                                                 | Waiting time after running a request to the database before running another one.|
| URL_LOAD_BOTTLENECK_MAX_CONCURRENT                 | no       | -                                                                 | Number of requests to the database running at the same time.
|

## Introduction

Url loader fetches data from API and saves them in the Azure storage. It parses configuration file that contains API requests. Part of this service is [Reload check functionality](#reload-check-functionality) that is used to fetch data again if their upload failed in previous days.

## YAML configuration file

Url loader parses one yaml configuration file located in ./sources folder that contains array of items. Each item is related to one API request. Check example yaml file in [tutorial](../tutorials/run-application-with-data-from-API#Configuration) and all parameters short description in [configuration files](../data-structures/config-files.md#url-loader-config). For more detailed info about functionality of parameters continue with this tutorial.

## Credentials

You can optionally set USERNAME and PASSWORD environment variables in ./env file. They will be used if your API requires login credentials for authentication. For this to work you must add credentials property to your yaml file config item exactly like [here](../data-structures/config-files.md#URL-LOADER).

## Reload check functionality

For specific case, when the data is fetched daily and query contains date in ISO string format or 'yyyymmdd' format, there is autofix functionality for failure. With reload check set for attributeId or array of attributeIds, data in database is verified and all missing data is fetched again, even after multiple days of failed requests. If no data is found in the database, it will fetch last seven days. Data from previous day is always fetched.
