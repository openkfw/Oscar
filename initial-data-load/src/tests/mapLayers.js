const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const LayerGeoData = require('../mapLayers/layerGeoDataSchema');
const { MapLayer } = require('../mapLayers/mapLayersSchema');

jest.mock('azure-storage');

describe('Geo data', () => {
  let geoDataSource;
  let mapLayerDataSource;

  beforeAll(async () => {
    geoDataSource = await yaml.load(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'testCountry', 'GeoData.yml'), 'utf8'),
    );
    mapLayerDataSource = await yaml.load(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'testCountry', 'MapLayers.yml'), 'utf8'),
    );
  });

  it('should save nothing, if data for country not found', async () => {
    jest.mock('../config/config.js', () => {
      return {
        uploadDataTypes: 'mapLayers',
        country: 'nonexistent',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });

    await uploads();
    const geoData = await LayerGeoData.find({}).lean();
    expect(geoData).toHaveLength(0);
    const mapData = await MapLayer.find({}).lean();
    expect(mapData).toHaveLength(0);
  });

  it('should save nothing, if file from country missing', async () => {
    jest.mock('../config/config.js', () => {
      return {
        uploadDataTypes: 'mapLayers',
        country: 'testCountry2',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });
    await uploads();
    const geoData = await LayerGeoData.find({}).lean();
    expect(geoData).toHaveLength(0);
  });

  it('should not save geo data, if referenceId already used', async () => {
    const existingGeoData = {
      referenceId: geoDataSource[0].referenceId,
      geoDataUrl: '/some.other.geojson',
      name: 'Caption',
      updateDate: Date.now(),
    };
    await LayerGeoData.create(existingGeoData);

    jest.mock('../config/config.js', () => {
      return {
        uploadDataTypes: 'mapLayers',
        country: 'testCountry',
      };
    });
    jest.mock('../mapLayers/storage.js', () => {
      return {
        saveGeoJsonFromUrlSourceToStorage: () => 'newName.geojson',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });
    await uploads();
    const collections = await mongoose.connection.db.listCollections().toArray();
    expect(collections).toHaveLength(2);
    const geoData = await LayerGeoData.find({}).lean();
    expect(geoData).toHaveLength(1);
    expect(geoData[0].name).toEqual(existingGeoData.name);
    expect(geoData[0].referenceId).toEqual(existingGeoData.referenceId);
    expect(geoData[0].geoDataUrl).toEqual(existingGeoData.geoDataUrl);
  });

  it('should update map layer data, if referenceId already used', async () => {
    const existingGeoData = {
      referenceId: geoDataSource[0].referenceId,
      geoDataUrl: '/some.other.geojson',
      name: 'Caption',
      updateDate: Date.now(),
    };
    await LayerGeoData.create(existingGeoData);
    const existingMapLayer = { ...mapLayerDataSource[1], title: 'First title' };
    await MapLayer.create(existingMapLayer);
    jest.mock('../config/config.js', () => {
      return {
        uploadDataTypes: 'mapLayers',
        country: 'testCountry',
      };
    });
    jest.mock('../mapLayers/storage.js', () => {
      return {
        saveGeoJsonFromUrlSourceToStorage: () => 'newName.geojson',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });
    await uploads();
    const collections = await mongoose.connection.db.listCollections().toArray();
    expect(collections).toHaveLength(2);
    const mapData = await MapLayer.find({}).lean();
    expect(mapData).toHaveLength(3);
    expect(mapData[0].referenceId).toEqual(mapLayerDataSource[1].referenceId);
    expect(mapData[0].title).toEqual(mapLayerDataSource[1].title);
    expect(mapData[1].referenceId).toEqual(mapLayerDataSource[0].referenceId);
    expect(mapData[1].geoReferenceId).toEqual(mapLayerDataSource[0].geoReferenceId);
    expect(mapData[2].referenceId).toEqual(mapLayerDataSource[2].referenceId);
    expect(mapData[2].geoReferenceId).toBeNull();
    expect(mapData[2].layerType).toEqual('group');
    expect(mapData[2].layers).toHaveLength(3);
    mapData[2].layers.map((layer) => expect(layer.geoReferenceId).toEqual(geoDataSource[0].referenceId));
  });

  it('should save data for country from config', async () => {
    jest.mock('../config/config.js', () => {
      return {
        uploadDataTypes: 'mapLayers',
        country: 'testCountry',
      };
    });
    jest.mock('../mapLayers/storage.js', () => {
      return {
        saveGeoJsonFromUrlSourceToStorage: () => 'newName.geojson',
      };
    });

    let uploads;
    jest.isolateModules(() => {
      uploads = require('../index'); // eslint-disable-line  global-require
    });
    await uploads();
    const collections = await mongoose.connection.db.listCollections().toArray();
    expect(collections).toHaveLength(2);
    const geoData = await LayerGeoData.find({}).lean();
    expect(geoData).toHaveLength(1);
    expect(geoData[0].name).toEqual(geoDataSource[0].name);
    expect(geoData[0].referenceId).toEqual(geoDataSource[0].referenceId);
    expect(geoData[0].geoDataUrl).toEqual('/api/uploads/geojsons/newName.geojson');
    expect(geoData[0].updateDate - Date.now()).toBeLessThan(60000); // less than 1min

    const mapData = await MapLayer.find({}).lean();
    expect(mapData).toHaveLength(3);
    expect(mapData[0].referenceId).toEqual(mapLayerDataSource[0].referenceId);
    expect(mapData[0].geoReferenceId).toEqual(mapLayerDataSource[0].geoReferenceId);
    expect(mapData[1].referenceId).toEqual(mapLayerDataSource[1].referenceId);
    expect(mapData[1].geoReferenceId).toEqual(mapLayerDataSource[1].geoReferenceId);
    expect(mapData[2].referenceId).toEqual(mapLayerDataSource[2].referenceId);
    expect(mapData[2].geoReferenceId).toBeNull();
    expect(mapData[2].layerType).toEqual('group');
    expect(mapData[2].layers).toHaveLength(3);
    mapData[2].layers.map((layer) => expect(layer.geoReferenceId).toEqual(geoDataSource[0].referenceId));
  });

  it('should save without geoDataUrl, if unable to store geodata', async () => {
    let uploads;
    jest.isolateModules(() => {
      jest.mock('../config/config.js', () => {
        return {
          uploadDataTypes: 'mapLayers',
          country: 'testCountry',
        };
      });
      jest.mock('../mapLayers/storage.js', () => {
        return {
          saveGeoJsonFromUrlSourceToStorage: () => false,
        };
      });
      uploads = require('../index'); // eslint-disable-line  global-require
    });
    await uploads();

    const collections = await mongoose.connection.db.listCollections().toArray();
    expect(collections).toHaveLength(2);
    const geoData = await LayerGeoData.find({}).lean();
    expect(geoData).toHaveLength(1);
    expect(geoData[0].referenceId).toEqual(geoDataSource[0].referenceId);
    expect(geoData[0].geoDataUrl).toBeUndefined();
    const mapData = await MapLayer.find({}).lean();
    expect(mapData).toHaveLength(3);
  });

  it('should save geodata from files', async () => {
    const geoDataSource3 = await yaml.load(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'testCountry3', 'GeoData.yml'), 'utf8'),
    );

    let uploads;
    jest.isolateModules(() => {
      jest.mock('../config/config.js', () => {
        return {
          uploadDataTypes: 'mapLayers',
          country: 'testCountry3',
        };
      });
      jest.mock('../mapLayers/storage.js', () => {
        return {
          saveGeoJsonFromFileToStorage: () => 'newFilename.geojson',
        };
      });
      uploads = require('../index'); // eslint-disable-line  global-require
    });
    await uploads();
    const collections = await mongoose.connection.db.listCollections().toArray();
    expect(collections).toHaveLength(2);
    const geoData = await LayerGeoData.find({}).lean();
    expect(geoData).toHaveLength(2);
    expect(geoData[0].referenceId).toEqual(geoDataSource3[0].referenceId);
    expect(geoData[0].geoDataUrl).toEqual('/api/uploads/geojsons/newFilename.geojson');
    expect(geoData[0].format).toEqual(geoDataSource3[0].format);
    expect(geoData[0].featureIds).toEqual(geoDataSource3[0].featureIds);
    expect(geoData[0].attributeIds).toEqual(geoDataSource3[0].attributeIds);
    expect(geoData[0].geometryDataTypes).toEqual(geoDataSource3[0].geometryDataTypes);
    expect(geoData[0].metadata).toEqual(geoDataSource3[0].metadata);

    expect(geoData[1].referenceId).toEqual(geoDataSource3[1].referenceId);
    expect(geoData[1].geoDataUrl).toBeUndefined();
  });
});
