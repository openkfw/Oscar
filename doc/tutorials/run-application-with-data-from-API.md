# Run Oscar application with sample data fetched from external API

With the source code we provide predefined configuration file for fetching data from external API. For more info about this functionality check [URL loader service description](../services/url-loader.md).

## What kind of data and from where?

As most of the team members are from Slovakia, we chose to fetch a sample data related to Slovakia. COVID-19 API we used is created through automation platform [APIFY](https://apify.com/covid-19). All COVID-19 APIs there are open-source and free to use without any limitations. Data source for Slovakia COVID-19 API is [Coronavirus (COVID-19) in the Slovak Republic in numbers page](https://korona.gov.sk/en/coronavirus-covid-19-in-the-slovak-republic-in-numbers/). Latest data for one day in JSON format are available at this [URL](https://api.apify.com/v2/key-value-stores/GlTLAdXAuOz6bLAIO/records/LATEST?disableRedirect=true).

## Configuration

URL loader configuration file and all necessary environment variables are set by default. You can just run the scripts as in following section. You can find further description of configuration file properties [here](../data-structures/config-files.md#url-loader-config).

./url-loader/sources/ExampleDailyUrls.yml

```- name: APIFY Covid19 statistics
  url: https://api.apify.com/v2/key-value-stores/GlTLAdXAuOz6bLAIO/records/
  data:
    - query: LATEST?disableRedirect=true
      name: "Daily Covid19 cases in Slovakia"
      filename: slovakia_daily_cases_{{date}}.json
      foldername: slovakia_daily_cases
```

## Run Oscar application

If this is your first attempt to run the application, please consult [Getting started](../getting-started/run-application.md) first. There are some necessary prerequisities.
Then you need to run these three scripts:

`./start.sh` will start the api, frontend and database. Once you can see the frontend, you can go to next script.

`./runinitialload.sh` script will run the Initial data load service to fill application with data. Wait until this is finished (you will see `Successfully uploaded all initial data.` in terminal). This script creates necessary Blob containers in Azure storage.

`./runurlload.sh` script will run URL loader service to fetch data from external API and stores them in the Azure storage. Wait until this is finished (you will see `Data from ExampleDailyUrls.yml stored in storage.` in terminal). Go to the browser and reload the page. Now you have the application set.

## What can be seen in application

For now you can check just that data are saved in raw-data Blob container in [Azure Storage Explorer](../development/development.md#setup-microsoft-azure-storage-explorer). With later introduction of Azure functions linked with URL loader service, you will be able to see data on the map.

## What's next

The next step will be creation of Azure functions, triggered by URL loader saving data. These functions will process data that they get from Azure storage and save them in the attributes collection in the database. Then you can show this data in map layers. This is not implemented yet. After this is implemented, you will be able to use URL loader's Reload check functionality.

### Reload check functionality

1. This functionality makes sense just for data fetched fetched regularly.
2. Dynamically add yesterday's date value in ISO string format: {{ISOdate}} or 'yyyymmdd' format: {{date}} to query property in configuration file based on what your API expects as a date.
3. Run URL loader.
4. Check which attributeIds are created in the attributes collection after running URL loader. Filter on your own those attributeIds which are related to your URL loader request.
5. Put them in reloadCheck property in configuration file as a bulleted list. This will check if there are documents with these attributeIds in the attributes collection for everyday, from the first day you have uploaded to the database till yesterday, whenever you run URL loader. If they are not there, it will fetch missing data from API.
