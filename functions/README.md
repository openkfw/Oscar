# Oscar platform functions

This folder contains definitions for Azure Functions used in the application for loading new data into database from files in azure storage or generating derived data from existing values in database.
Templates for quick creation of new functions are also stored here.

## Loader functions

Functions triggered on new file in specified folder in Azure storage. They are used for loading data from various types of files, processing them according to their structure and storing in database in new structure required by application.

### loader_template

As the name tells us, this is not one of running functions, only template prepared for quick setup of new functions of this type. Copy content of this folder in new folder and rename it with the name of your new function and follow [tutorial in documentation](../doc/tutorials/advanced/create-new-loader-function-from-template.md) to create functions for your specific file type or data structure.
Before you jump into programming, you might want to check existing functions in following sections.

### csv_loader

This function is still work in progress, will be released in version 1.1.0 with updated documentation.
