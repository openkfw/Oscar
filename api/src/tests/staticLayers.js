const request = require('supertest');

const app = require('../config/express');
const LayerGeoData = require('../dbSchemas/layerGeoDataSchema');
const { MapLayer, GroupMapLayer, SingleMapLayer } = require('../dbSchemas/mapLayersSchema');
const { mapLayersInDb, layerGeoDataInDb } = require('../testUtils/testData/staticLayers');

jest.mock('azure-storage');
jest.mock('../config/config.js', () => {
  return {
    authorizeTokenAttribute: false,
  };
});

describe('GET /api/staticLayers', () => {
  it('should return empty array, if no geodata and no point layers in db', async () => {
    await MapLayer.create(mapLayersInDb[0]);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(0);
  });

  it('should return point layer without geoDataReferenceId', async () => {
    await SingleMapLayer.create(mapLayersInDb[3]);

    const res = await request(app).get('/api/staticLayers');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].referenceId).toEqual(mapLayersInDb[3].referenceId);
    expect(res.body[0].geoReferenceId).toEqual(undefined);
  });

  it('should return all layers in db sorted by title with data from layerGeoData collection', async () => {
    await LayerGeoData.create(layerGeoDataInDb);
    // saved in reverse order to check the sorting
    await MapLayer.create(mapLayersInDb[1]);
    await MapLayer.create(mapLayersInDb[0]);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].geoReferenceId).toEqual(layerGeoDataInDb.referenceId);
    expect(res.body[0].referenceId).toEqual(mapLayersInDb[0].referenceId);
    expect(res.body[0].geoDataUrl).toEqual(layerGeoDataInDb.geoDataUrl);
    expect(res.body[0].format).toEqual(layerGeoDataInDb.format);
    expect(res.body[0].metadata.geoMetadata).toEqual(layerGeoDataInDb.metadata);
    expect(res.body[0].timeseries).toEqual(mapLayersInDb[0].timeseries);
  });
  it('should return layer of type group with correct geodata links and format in sublayers', async () => {
    await LayerGeoData.create(layerGeoDataInDb);
    await GroupMapLayer.create(mapLayersInDb[2]);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].referenceId).toEqual(mapLayersInDb[2].referenceId);
    expect(res.body[0].layerOptions).toEqual(mapLayersInDb[2].layerOptions);
    res.body[0].layers.forEach((layer) => {
      expect(layer.geoDataUrl).toEqual(layerGeoDataInDb.geoDataUrl);
      expect(layer.format).toEqual(layerGeoDataInDb.format);
      expect(layer.metadata.geoMetadata).toEqual(layerGeoDataInDb.metadata);
    });
  });
});
