# 7 days incidence rata calculation function

Function that calculates 7 days incidence rate using following formula: (positiveNumber \* 100000) / population

## How to use

Move folder with this function from library directly in `functions` folder. Now move `incidenceCalculationConfig.yml` from the folder with function into `functions/data` folder.

Path to config file is also different environment variable, `CONFIG_FILE_PATH`, by default directed to `incidenceCalculationConfig.yml`. If you just modify this file, the environment variable can be omitted.

Default values in this config are based on `Sample` country in `initial-data-load`. You can change these values in following structure according to your setup:

```
- calculatedAttribute: "7 Days Incidence Rate Per " # used as calculated attributeId in connection with country level
  databaseCollection: "featureAttributes" # database collection where base entries and calculated entries resides
  dailyCasesBaseAttribute: "Daily Covid19 Cases Per " # base attribute of daily cases used for incidence calculation
  populationBaseAttribute: "Population Per " # base attribute of population used for incidence calculation
  countryLevel0: "Admin0" # highest country level (country) to connect with cases/population attribute
  countryLevel1: "Admin1" # first country level (province) to connect with cases/population attribute
  countryLevel2: "Admin2" # second country level (district) to connect with cases/population attribute
```

Function is then triggered by Azure Storage queue message `incidence-rate-calculation`. After function finishes successfully, new entries will be present in `databaseCollection` from setup above, if there is enough data for calculation. You can find them by `calculatedAttribute` connected with `countryLevel` properties, i.e. "7 Days Incidence Rate Per Admin0".
