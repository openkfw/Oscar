Detailed explanations of structure of configuration files.     

## Dashboard tabs config
```
map:
  x: number
  y: number
  zoom: number
```
Map coordinates in [x,y] format and zoom level.
```
tabs:
  PublicTab:
    index: 0
```
In first version we have only one tab, so the lines above should stay as they are.
```
    attributeIds:
```
As there are no pre-set attributeIds in database, the attributeIds need to be used in constants for frontend. 
```
      CASES_BY_DAY_PROVINCES: attributeId for new covid-19 cases on admin1 administrative geographical level 
      SEVEN_DAYS_COINCIDENCE: attributeId for 7 days incidence rate on covid-19 cases on admin1 administrative geographical level 
      NEW_CASES_TOTAL: attributeId for total cases for country from yesterday
      DEATHS_TOTAL: attributeId for total deaths for country from yesterday
      INFECTED_TOTAL: attributeId for total infected for country from yesterday
      RECOVERED_TOTAL: attributeId for total recovered for country from yesterday
      DEATH_YESTERDAY_INCREASE: attributeId for new deaths for country from yesterday
      RECOVERED_YESTERDAY_INCREASE: attributeId for newly recovered for country from yesterday
      NEW_CASE_YESTERDAY_INCREASE: attributeId for new cases for country from yesterday
      TOTAL_CASES_PER_ADMIN0: first common part of attributeIds on admin0 level
      TOTAL_CASES_PER_ADMIN1: first common part of attributeIds on admin1 level
```

## geoData.yml    
File is basically one long array with items for each geojson that should be stored.      
Structure of one item:    
_with geojson file provided by url to publicly available source_      
```
- name: descriptive name for human reference
  referenceId: unique id for the geojson, the file will be referred by this value
  geoJSONUrl: full publicly available url
```     
_or with geojson file provided in folder './initial-data-load/data/{COUNTRY}/geoData/'_       
```
- name: descriptive name for human reference
  referenceId: unique id for the geojson, the file will be referred by this value
  geoJSONFilename: name of the file in above mentioned folder
```
## mapLayers.yml
This config file is one long array with settings for layers in map. As there are multiple types of layers (regions, points on map, any geometrical objects or even combination of them) and also multiple sources of data for one layer, the structure of items in array may vary greatly.   
       
       
![mapLayersStructure](./mapLayersStructure.jpg) 
   
### Attributes explained
**referenceId**: unique id for the layer, the layer will be referred by this value,      
**geoReferenceId**: unique 'referenceId' of geojson from geoData.yml,       
**category**: each layer can be organised into category based on data. In current version, validation allows only one of following: 'Baseline data', 'Health facilities' or 'Covid-19'. 
**title**: name of the layer in layers menu in UI 
  **layerType**: the application accepts multiple types of geographical data. Either the country is divided in areas ('regions') or there are only coordinates for places ('points'). It can also have just specific geometrical objects in 'geometry' layers or even combination of points and geometry in 'combined' layer. In case there are multiple sources, the overall layer is 'group' and it has 'layers' array with multiple layers of the other types.    
**attribute**: either name of property in Feature in geojson or attributeId in attributes collection with data for this layer,     
**attributeDescription:**       
*   **descriptionText**: description of the value, will be displayed in 'What is here' popup,       
*    **featureText**: description with additional information, e.g. administrative level,     
*    **noDataMessage**: this message will be there, if value is missing,   
*    **dateText**: description of date, if it should be displayed,

**featureId**: property in Feature in geojson file under which the value for 'featureId' in attributes is stored,  
  
**metadata**: informations about data in layer, they are shown when you click on info button aside from map layer in layers menu 
*    **description**:,
*    **sourceWebsite**:,
*    **sourceOrganisation**:,
*    **updateDate**:,
*    **updateFrequency**:,
*    **unit**:,
*    **reliabilityScore**:,
*    **dataRetrievalDescription**:,
*    **dataCalculationDescription**:,

**timeseries**: true or false, whether there are values from multiple dates in database and they should be displayed on frontend in timeline. If this value is false, the latest data are fetched,            

#### Style object
Style and legend values are specific for each type or geographical data as well as attributes values type. In this section they will be explained for each of the bottom boxes in the graph above.

##### Basic building block
For style, on the lowest level, the color object is defined in following structure:    
```
type: 'color'/'colormap'
value:
```
The application accepts types: 'color', which is basically string with color in any css accepted format (usually color name or rgba value) and 'colormap' which has fixed list of available maps: ['blue', 'green', 'red', 'hot'].      
      
##### regions layer with attribute data in categories    
In case the geographical layout of data is in regions (country is divided into areas and there is value for each area) and there is fixed set of available values for used attribute, the style is set with color for each value. 'fillColor' attribute has the values as keys. Each of them has standard color structure.     
For the borders of regions, one 'strokeColor' in style object can be defined in the basic color structure.       
##### regions layer with attribute with numeric values in interval
Regions can also have values from numeric interval. In that case style object needs 'min' and 'max' values and the color is picked from colormap scaled by this min and max.     
##### points layer
This layer displays geojson Features with only one pair of longitude latitude coordinates as filled circle. Inside of the circle is in 'fillColor' and the outline in 'strokeColor'.
##### geometry layer
For custom geometrical object, like open polylines or polygons. Style in this layer allows to specify two color values similarly as in graphic applications, one for strokes created by arrays of points in geojson Features and second for filling closed objects/triangles created by this points.        
Only in this layer, new array with decoration on the stroke is available. In first version, only one embellishment is available.
```
strokeDecorations:
  - lineDash
```
As the name of it prompts, with this enabled, the stroke line is dashed.      
##### combined layer
Not always are data nicely structured in only one way. For this cases, combined layers style is able to show points and geometrical shapes in one layer.
#### Legend object
Legend values are closely intertwined with style. Basically for each color or colormap used in visualisation, there should be one item in legend array.      
For values with type 'color', the legend item has these three keys:       
```
'type': 'color'
'color': color value, the same as in color object in style
'description': text which should be displayed in legend
```         
For values with type 'colormap', the legend has two more keys, copied from style:      
```
'type': 'color'
'color': color value, same as in color object in style
'min': same as in style
'max': same as in style
'description': text which should be displayed in legend
```  

## attributes
This folder is place to store files with data in .csv format. For the data to load correctly into database and connect with geographical data, following restrictions must be met:    
- delimiter in this file is ';' or ','
- one of the columns (preferably the first one) is called 'AdminArea' and contains names of geographical areas where the value is from.
- the name of column with data is the same as 'attributeId' in attributes collection in the database and it is used by graphs on dashboard which shows this data. 
## index.js for attributes
This file produces array with all .csv files and dates that should be stored with the data. Only files in this array will be processed by the service, so all data can be stored in the 'attributes' folder but not necessary uploaded in one run. 
This file can be best understood by examples:    
_simple version with only hardcoded values_
```
module.exports = [
  {
    date: '2020-07-08T00:00:00.000Z',
    csvFileName: 'Filled_Template_C19_Active_Cases.csv',
  },
  {
    date: '2020-07-08T00:00:00.000Z',
    csvFileName: 'Base_C19_Data_Risk_Indices.csv',
  },
  {
    date: '2020-07-08T00:00:00.000Z',
    csvFileName: 'FilledTransmissionClassificationTemplate.csv',
  },
];
```
_or using relative dates_
```
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

module.exports = [
  {
    date: new Date(now - 1 * oneDay).toISOString(),
    csvFileName: 'Cases_increase_from_yesterday.csv',
  },
  {
    date: new Date(now - 1 * oneDay).toISOString(),
    csvFileName: 'Total_cases.csv',
  },
  {
    date: new Date(now - 1 * oneDay).toISOString(),
    csvFileName: 'Total_Covid19_cases_per_country.csv',
  },
  {
    date: new Date(now - 1 * oneDay).toISOString(),
    csvFileName: 'Total_Covid19_cases_per_region.csv',
  },
];

```