# Fine-tune csv loader function

In this tutorial, we will walk through modifications to enable processing csv files with formats slightly different from the one used in default settings.

In one section we will also change watched folder. This way can multiple instances of this function watching different folders with varying structures in csv files.

## Prerequisities

This changes require new build. That means, you need to [start the app locally](./start-application-locally-for-development.md) and restart the application after the changes are done.

## Change parsing constants

During parsing process, names of columns for 'featureId', 'attributeId' and 'date' are set in constants.js file.

First constant, `FEATUREID_KEY`, stores name of column with name of geographical area. Default value is `AdminArea`. 

If you have date in ISOString format, you can use it instead of autofill with current time, by setting `DATE_KEY` as corresponding column in file.

If `ATTRIBUTEID_KEYS` are not defined, all columns except the ones with featureId and date are stored, each as separate attribute with name of the column as attributeId. 

This might not be wished and won't be the case by most of external APIs. Therefore we introduced this constant. If this constant is defined, only columns with names specified in object in array forming `ATTRIBUTEID_KEYS` are processed and stored into database.

Each object in this array can have two keys. Either `attributeId` in database is the same as column name, or second key in object in `ATTRIBUTEID_KEYS` under `attributeId`. Both cases can be seen in commented out section in constants:
```
export const ATTRIBUTEID_KEYS = [
  {
    key: 'Daily Covid19 Cases Per Admin1',
    attributeId: 'Daily Covid19 Cases Per Admin1',
  },
  {
    key: 'Population per Admin1',
  },
];
```

## Change folder name

Folder name is defined in function.json file in folder with the function (./functions/csvLoader). In "path" key at line 7, replace 'csvData' with name of new folder.
