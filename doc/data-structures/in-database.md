# Data structure of data in database

Overview of data structures used in application.

# Map data config structure
To import data for map view, folder with config files directly in initial-data-load folder is used. Based on 'COUNTRY' environment variable, folder with the same name as is value in this variable is selected from 'data' folder and data from config files inside are processed.    
Example data in correct structures can be found in 'Sample' folder.      
   
Data for layers in map view is stored in three different collections in database separately.  Geographical data, informations about layers and styling and last data to be visualised.    
### Geographical data
Geographical data is supported only in [geojson format](https://geojson.org/) as of now.     
This data is stored in cloud storage (Azure Blob Storage) and information about it is stored in 'layerGeoData' collection in following structure:     
```
referenceId: unique id of this data, will be referred in specific layers
name: name of the data, for easier human identification
geoJSONUrl: route in api where this data can be found and fetched from
updateDate: time of last change, added automatically in timestamp format
```    
    
This data is loaded from 'GeoData.yml' config file directly in data/{{COUNTRY}} folder from following structure:
```
referenceId: as in database
name: as in database
geoJSONUrl: complete url for data, the data will be fetched and stored in Azure Storage container, please consider licence before using a link with data
``` 
     
### Layer configuration and informations     
Layer configurations are saved in 'mapLayers' collection in following structures: 

#### Single map layer  
```
referenceId: unique id of layer
geoReferenceId: referenceId of document in layerGeoData collection with information about geojson file
layerType: type of layer data, valid values: 'regions', 'points', 'geometry', 'combined'
category: category of data, layers in menu on UI are grouped by this category
title: user-friendly short description of data shown in UI
attribute: attributeId for values in database or name of property in geojson
attributeDescription:
  descriptionText: text used in detail about specific value, can use properties stored in geojson in following format {{propertyName}}
  featureText: specific text for geographical name, e.g. 'Province: {{featureId}}'
  noDataMessage: if value for the geographical unit is not available, this message will be displayed
  dateText: month for which the data applies, in this format: 'Reported period: {{dataDate}}'
featureId: property name in geojson for geographical information
timeseries: boolean value, whether timeseries data are available
style:
  fillColor:
    type: type of color information, valid values: 'color', 'colormap'
    value: string with color in one of standard formats or name of predefined colormap
  min: minimal value for colormap for correct color scaling
  max: maximal value for colormap for correct color scaling
  strokeColor:
    type: type of color information, valid values: 'color', 'colormap'
    value: string with color in one of standard formats or name of predefined colormap
  missingValueColor: color used if the value is missing
  clusterFillColor: if the features are clustered, this color is used for clustered feature
  clusterStrokeColor: if the features are clustered, this color is used for clustered feature
  strokeDecorations: 
    - 'lineDash'    lines should be dashed
    - 'widthByAttribute'      width of lines is calculated based on this attribute
legend: array with all values for legend
  - type: type of visualization, valid values: 'color', 'colormap'
    color: string with color in one of standard formats or name of predefined colormap
    description: text about values in this color
metadata: information about the layer
  description: String
  sourceWebsite: String
  sourceOrganization: String
  updateDate: String
  updateFrequency: String
  unit: String
  reliabilityScore: String
  dataRetrievalDescription: String
  dataCalculationDescription: String
```
or 

#### Group map layer    
```
referenceId: unique id of layer
layerType: type of layer data, valid values: 'group'
category: category of data, layers in menu on UI are grouped by this category
title: user-friendly short description of data shown in UI
layers: array with layers of structure from above
  - geoReferenceId: id of document in layerGeoData collection with information about geojson file
    layerType: type of layer data, valid values: 'regions', 'points', 'geometry', 'combined'
    title: user-friendly short description of data
    attribute: attributeId for values in database or name of property in geojson
    attributeDescription:
      descriptionText: text used in detail about specific value, can use properties stored in geojson in following format {{propertyName}}
      featureText: specific text for geographical name, e.g. 'Province: {{featureId}}'
      noDataMessage: if value for the geographical unit not available, this message will be displayed
      dateText: month for which the data applies, in this format: 'Reported period: {{dataDate}}'
    featureId: property name in geojson for geographical information to match with data from database
    timeseries: boolean value, whether timeseries data are available
    style:
      fillColor:
        type: type of color information, valid values: 'color', 'colormap'
        value: string with color in one of standard formats or name of predefined colormap
      min: minimal value for colormap for correct color scaling
      max: maximal value for colormap for correct color scaling
      strokeColor:
        type: type of color information, valid values: 'color', 'colormap'
        value: string with color in one of standard formats or name of predefined colormap
      missingValueColor: color used if the value is missing
      clusterFillColor: if the features are clustered, this color is used for clustered feature
      clusterStrokeColor: if the features are clustered, this color is used for clustered feature
      strokeDecorations: 
        - 'lineDash'    lines should be dashed
        - 'widthByAttribute'      lines are calculated based on this attribute
    legend: array with all values for legend
      - type: type of visualization, valid values: 'color', 'colormap'
        color: string with color in one of standard formats or name of predefined colormap
        description: text about values in this color
metadata: information about the layer
  description: String
  sourceWebsite: String
  sourceOrganization: String
  updateDate: String
  updateFrequency: String
  unit: String
  reliabilityScore: String
  dataRetrievalDescription: String
  dataCalculationDescription: String
```    
    
# Attributes
Attributes are stored in attributes collection. Each document is created for one geographical unit in official levels and for given date. They are used in [map view](../UI/map.md), linked by 'attribute' in mapLayers collection and 'attributeId' in attributes collection.     
The data is stored in following structure:    
```
attributeId: name of attribute, defines what the value is
featureId: name of geographical area, defines where the value is
date: date, defines when the data was taken, ISO string
dataDate: specific value for date from data in format other than ISO string, or data from time interval 
```    
This data is either stored by automatic processes or can be uploaded from csv files, both from initial-data-load or from UI, if respective feature is enabled. You can find more about how to load this data in this [tutorial](../tutorials/run-application-with-own-data.md).