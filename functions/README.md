# Oscar platform functions

This folder contains definitions for Azure Functions used in the application for loading new data into database from files in azure storage or generating derived data from existing values in database.
Templates for quick creation of new functions are also stored here.

## Loader functions

Functions triggered on new file in specified folder in Azure storage. They are used for loading data from various types of files, processing them according to their structure and storing in database in new structure required by application.

### loader_template

As the name tells us, this is not one of running functions, only template prepared for quick setup of new functions of this type. Copy content of this folder in new folder and rename it with the name of your new function and follow [tutorial in documentation](../doc/tutorials/advanced/create-new-loader-function-from-template.md) to create functions for your specific file type or data structure.
Before you jump into programming, you might want to check existing functions in following sections.

### csv_loader

Basic loader for csv files from genetic folder in Azure storage. As it is, the function can load any csv file with geographical data stored in column called 'AdminArea' and all attributes in columns called by their wished 'attributeId'. Also in current database structure, only numerical values are accepted.
The function is triggered when new file is stored in 'csvData' folder. For more details on finetuning this function, check [in the documentation](../doc/tutorials/advanced/fine-tune-csv-loader-function.md).

## Fetcher functions

This functions connect to external API, fetch data, process it and store it directly in database, without storing raw data first in file in storage.

### KOBOFetcher function

This function is used for scheduled fetching of results of surveys at KOBO. Requires own connection to KOBO instance with url, connection string and asset id of survey. Before using, please read README.md file in respective folder.
