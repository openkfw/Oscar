# How to create new loader function from template

In this tutorial, we will walk through our template and create simple loader function for files in json format.

## Data

For this tutorial, we are choosing strict data structure, to keep focused on how the template can help in more complex cases.
Our JSON file will have only one key, "data", with array of objects with two keys, first "province" with geographical value, featureId from geojson and second "covid19" with number of cases.

```
{
  "data": [
    { "province": "Province 1", "covid19": 5 },
    { "province": "Province 2", "covid19": 29 }
  ]
}
```

If you find previous paragraph confusing, please check [how to run application with own data](TODO link) tutorial.

## Copy template

Copy loaderTemplate folder and rename it to your wished function name. The name needs to be in camelCase with first letter in lowercase. Update the name also in function.json in "name" and "scriptFile" keys. Rename the function in index.ts file, in export from this file and provide short description of your functionality.

In our case, we name our new function `simpleJSONLoader`.

## Set up folder in Azure storage container

All loader functions are triggered by new or updated file in predefined folder in Azure storage container 'raw-data'. Data into this folder can be uploaded manually e.g. via [Storage Explorer](TODO link to development docs page) or in azure portal, if application is running in cloud. Another (preferred) solution is to set up scheduled [url-loader](TODO url-loader docs) to fetch the data automatically and store them in correct folder.
Name of this folder is in two places, where we update it. First is again in function.json as "path". For the purposes of this tutorial, we name it `jsonfiles`, but for real use we recommend name the folder after the data rather than the file type. Folder name can contain only small letters, numbers and '-'.
The name is mentioned in description of the function in index.ts, please update it there, too.

After this, the function.json file is finished and looks like:

```

  "bindings": [
    {
      "name": "simpleJSONLoader",
      "type": "blobTrigger",
      "direction": "in",
      "path": "raw-data/jsonfiles/{filename}",
      "connection": "AZURE_STORAGE_CONNECTION_STRING"
    }
  ],
  "scriptFile": "../dist/simpleJSONLoader/index.js"
}
```

In index.ts, the description of function:

```
/**
 * Function triggered by new file in blob storage container (jsonfiles/{filename}).
 * Loading data from simple JSON file with predefined key for geographical featureId in azure storage blob container.
 * Mapping data into required mas structure.
 * Storing data in database collection in correct format.
 * @param {object} context - Azure function's context (e.g. for metadata, logging)
 * @param {buffer} incomingBlob - blob storage content, in this case a JSON file
 */
const simpleJSONLoader: AzureFunction = async (context: Context, incomingBlob: Buffer): Promise<void> => {
```

## Prepare typescript type

The code is written is typescript, therefore we will start with defining typescript interface for the data in file, or more precisely, data extracted from file in `fileLoader` function. Types are stored in `types.ts` and here, we will update `ItemFromFile`:

```
export interface ItemFromFile {
  province: string;
  covid19: number;
}
```

For data in database, Joi validation is used. You can also validate data from file before processing, you can find empty schema in [joiSchemas.ts](../../../functions/loaderTemplate/joiSchemas.ts).

## Load file

Now we can move further down in the index.ts file and search for TODOs. First step is to load data from file which triggered the function. This file is automatic second parameter in our function and is already passed to fileLoader functions. We move to file for this function in `components` folder.
JSON files are extremely easy to transform into javascript objects with build-in function JSON.parse().

```
/**
 * Load data from JSON file and return values in data array
 * @param  {Buffer} incomingBlob - blob which triggered the function and is processed
 * @returns {Array<object>} - array with data from file
 */
const fileLoader = (incomingBlob: Buffer) => {
  // parse data in buffer as text
  const text = incomingBlob.toString();
  // parse object from text
  const dataInObject = JSON.parse(text);
  // and return  array of javascript objects with data
  return dataInObject.data;
};
```

## Data parsing

Now we have data in javascript array, which can be further processed and transformed to suit structure required by our database. This functionality is stored in dataParser in `components` folder.
Here we go through each item in data array and map them to required structure.
We have described structure of the data in file. For structure in database, please consult [database structure documentation page](TODO link). Since our data has quite similar structure, we can produce final structure with just one map function. There is no specific date value present with the data, therefore we will use today. We create new attributeId and store it in constants.ts, so once we need to change it, there is single instance to change.

```
/**
 * Process data and return them in correct format to store into database
 * @param  {Array<object>} data - data from file
 * @returns {Array<Attribute>} - returns array of attributes
 */
const dataParser = (data: Array<ItemFromFile>): Array<Attribute> => {
  const today = new Date(Date.now()).toISOString();
  const dataInDbStructure = data.map((item) => ({
    featureId: item.province,
    attributeId: ATTRIBUTE_ID,
    valueNumber: item.covid19,
    date: today,
  }));
  return dataInDbStructure;
};
```

## Storing to database

Since last function returns correct data format for storing, the data storing part is already done and prepared.

## Test run

All is set up, time to test our function locally.
Functions are commented out in `./docker-compose.yml` file. Remove the #s in 'function' part before starting application.

[Start application locally](../../getting-started/run-application.md), the function will start automatically. Once the application is running, we need to trigger this function with correct file in correct folder in Azure Storage Container. When we run it locally, the storage is also docker container on local machine. We can see logs from this container in terminal. For more info check [Development/Docker](../../development/development.md#docker). Upload the file into `raw-data` container in the folder, defined in function, in our case `jsonfiles`. Test files with correct and invalid data we used during this tutorial can be found in `./tests/data` folder. You might want to run the invalid file and check in logs, how error messages look like.

Check in the database at `http://localhost:8081/db/oscar/attributes`. There are the attributes stored in database with correct values.
Function is finished.
If you have API with this file, you can fetch new data automatically with [url-loader service](../../services/url-loader.md)

## Disclaimer

JSONLoader function we just created is not production ready. We omitted error handling and validation for the file.
