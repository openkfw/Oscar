# Run application with own data

This tutorial shows how to use own data in instance of Oscar and how to update this data while running application.(version 1.0.0)  

## tl;dr
List of environment variables settings and configuration files:    
Before start:   
- title in UI: ./frontend/.env  `REACT_APP_WEBSITE_TITLE=Oscar` 
- dashboard tabs: ./api/data/config/config.yml           
           
Anytime set & run 'initial-data-load' service:
- country name: ./runinitialload.sh `COUNTRY=Sample`
- data types to be uploaded into the database: ./runinitialload.sh `UPLOAD_DATA_TYPES=mapLayers,attributes`
- geodata: ./initial-data-load/data/{COUNTRY}/[geoData.yml](../../data-structures/config-files.md#geodata.yml)
- map layers: ./initial-data-load/data/{COUNTRY}/[mapLayers.yml](../../data-structures/config-files.yml#maplayers.yml)
- data in csv files: ./initial-data-load/data/{COUNTRY}/[attributes/](../../data-structures/config-files#attributes)
- config for csv files load: ./initial-data-load/data/{COUNTRY}/attributes/[index.js](../../data-structures/config-files#index.js-for-attributes)

## Configuration before start
Some of config files need to be created before running the app as they are part of the code or their values (environment variables) are included during build.     

### Environment variables
For UI part of application, we need to set the title (name of tab in browser). The name and placement of this variable depends on how the application is run.    
If frontend is run locally with `yarn start`, the variable needs to be placed in .env file inside frontend folder as `REACT_APP_WEBSITE_TITLE=Oscar`.    
If frontend is build into image, this variable needs to be present in build settings.

### ./api/data/config/config.yml
Dashboard tabs can be modified by setting values in config file './api/data/config/config.yml'. This file is in [yaml](https://yaml.org/) format and has following structure:       
         
Let's look at our Sample file first:    
```
map:
  x: 2208684
  y: 6219942
  zoom: 8
tabs:
  PublicTab:
    index: 0
    attributeIds:
      CASES_BY_DAY_PROVINCES: 'Daily Covid19 Cases Per Admin1'
      SEVEN_DAYS_COINCIDENCE: '7 Days Incidence Rate Per Admin1'
      NEW_CASES_TOTAL: 'Total new cases'
      DEATHS_TOTAL: 'Total death cases'
      INFECTED_TOTAL: 'Total infected cases'
      RECOVERED_TOTAL: 'Total Recovered cases'
      DEATH_YESTERDAY_INCREASE: 'Death cases increase from yesterday'
      RECOVERED_YESTERDAY_INCREASE: 'Recovered cases increase from yesterday'
      NEW_CASE_YESTERDAY_INCREASE: 'New cases increase from yesterday'
      TOTAL_CASES_PER_ADMIN0: 'Total Covid19 Cases Per Admin0'
      TOTAL_CASES_PER_ADMIN1: 'Total Covid19 Cases Per Admin1'
```    
#### map setting     
For map view in the UI, you can set [x,y] coordinates and zoom level to focus the map on area of interest.
#### tabs setting
In first version, there is only one Tab available.     
**index** is order of the tab in the top menu. In future versions, you can create multiple tabs and order them. Order starts at 0 and it should be sequence of consecutive numbers.      
**attributeIds** are names of attributes stored in database for specific graphs in tab. Each preset tab has own set of constants to be matched with data in database. Specific sets of attributeIds are described in [Dashboard Tabs](../../UI/dashboard-tabs.md).     
     
## Configuration and data in data filling service
`initial-data-load` service prepares structure in database and storage and fills them with data. This service can be run multiple times after the structure is set up.   
### Requirements for first run
On first run, this service is setting up database structure, indexes and storage structure necessary for data storing. To enable complete flexibility later, some of these values need to be set via environment variables.      
Make sure that following values are present for first run (they are set in ./runinitialload.sh script). Fill in your own COUNTRY and run the script in terminal.    
```
export COUNTRY=
export UPLOAD_DATA_TYPES=mapLayers,attributes
export NEW_STORAGE_CONTAINERS=layer-geo-data
docker-compose -f docker-compose.manual-services.yml up --build initial-data-load-service
```

### Where the data comes from   
All data for initial load service are stored in '/initial-data-load/data' folder. Based on environment variable COUNTRY; data from subfolder with the name will be processed.
In this folder, two sets of data can be stored.
First set is configuration for map view and will be loaded, if UPLOAD_DATA_TYPES is set as 'mapLayers'. Second set loads data into application and will load data from 'attributes' subfolder, if UPLOAD_DATA_TYPES is set as 'attributes'. Both sets can be loaded in one run with UPLOAD_DATA_TYPES='mapLayers,attributes'.

### Map layers      
Map layers on frontend have two types of data combined - geographical location and the data related to the point or area. Geographical part of data is stored in [geojson format](https://geojson.org/). These files can be either provided in 'geoData' folder or via urls to public sources online. Features in geojson format have also 'properties' key, where the data can be stored. We strongly advise against this option for data in administrative regions, as it is static and there can be only one set of data stored.      
The geometrical objects in geojson (Features), can be easily linked with data in database via one key in Features 'properties'. This is described in Attributes section. How to store attributes data will be later described in details. For now, we can expect the data under given 'attributeId'.        

In order to correctly link all data, we recommend following this steps:      
1. Get geojsons for all data with single coordinates per feature (one object on map), geometrical objects on map (shapes of buildings, lines of earthquake shakes, isochrones) and generic geojsons with various administrative levels. For introduction to the topic see [article at geodatasource.com](https://www.geodatasource.com/resources/tutorials/what-is-administrative-division/).    
2. List all used geojsons in config file 'GeoData.yml' directly in COUNTRY folder. Structure of items in this config is described in detail in [Data Structures](../../data-structures/config-files.md#geodata.yml).
3. Create list of map layers in config file 'MapLayers.yml'. Before we provide you with link to structure of items as above, keep in mind, that for 'attribute', you need either to take name of property in Feature from geojson or create your own 'attribute' which will be used for data in attributes structure also. With this in mind, let's create the layers with [following structure](../../data-structures/config-files.md#maplayers.yml).
  
4. In this step, we can finally make first run of initial data load service with our data. Check [Run application](../../getting-started/run-application.md) tutorial for details on how to start application locally.    

If everything went correctly, after you start application, run the service with correct environment variables and refresh web page in browser. The layers should be in [menu on frontend](../UI/map.md). For all layers with values only in geojsons, the values should be already there and the rest should have grey areas (or colour set for missing values), that we later get from attributes collection from the database.        
5. Now is time to move to attributes to fix the empty layers and fill dashboard with data.      
    
### Attributes
This functionality is run, if environment variable `UPLOAD_DATA_TYPES=layerAttributes` is set in `./runinitialload.sh` script and stores data for specific point (or interval) in space and time in 'attributes' collection. These values are stored in ["attribute" format](../../data-structures/in-database.md#attributes):
      
#### How to get this data into database   
Short answer is as you wish. As far as you keep the structure correct, the application can process them from database. As of now, we provide one way to store the data, but in following version, multiple ways will be presented and this tutorial will be automatically updated.       
'initial-data-load' service provides functionality to store data from csv file in specific format described in details later.          

### How to construct data into correct form for initial-data-load
Files in attributes folder must follow certain structure to be stored correctly. Since we created map layers first, we have some restrictions on them. If we fit all of following restrictions, the data will load correctly and map layers will show it without need of further modifications.      
- The files must be stored in .csv format and use ';' or ',' as delimiter.
- One of the columns (we recommend first, both from data ordering view and also to keep compatibility with possible breaking changes) should be named 'AdminArea'.       
In case we want to link this data with existing map layer and geojson, data in this column must be the same as values of property in Feature in geojson saved under featureId in map layer config. (See next step.) 
- The data is linked by map layer, so to find the correct property in geojson, see 'featureId' key in map layer. Use 'geoReferenceId' in this layer to find geoData with 'referenceId' with the same value. Once you found the item in geoData, you just look up the geojson and open it with editor of choice (we recommend [VSCode](TODO link to part of docs with our editor choice and plugins)). In each Feature, find among properties the one named after 'featureId' and copy the value into you .csv file in 'AdminArea' column. Once this is done, it's time to fill into next column(s) the actual data.
- Last restriction is about name of column with data - it must be 'attribute' from mapLayer you want to link this data with.

One csv file can contain more data for the same AdminArea list. Each will be stored with column name as 'attributeId'. This approach might be useful for regular update of multiple mapLayers with the same geojson (multiple values for the featureIds, e.g. in current covid-19 pandemic, number of cases, number of deaths and number of recovered).         

#### How to easily reuse 'attributes' functionality for regular updates
Although 'initial-data-load' has the word _initial_ in name, it can be run multiple times on already running application for data update.      
All that is needed is replace the data in .csv files with current data, update date in index.js file and run the service again with environment variable `UPLOAD_DATA_TYPES=attributes`. 
If the data is always uploaded for today or yesterday, this date can be set in the index.js as value relative to now (date and time in moment of running the service) and there will be only one place, where data need to be updated.    
The data will be stored under the new date and if the date is later than the previous one, this data will be automatically used. This approach also produces sets of data for different dates that will be loaded as timeline for layers with key [layerOptions: timeseries: true](../../UI/map.md) set in MapLayers.yml.