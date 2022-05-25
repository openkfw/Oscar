import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import axios from 'axios';
import config from '../config/config';
import logger from '../config/winston';

import { createCollection, clearCollection } from '../database';
import { getOneLayerGeoData, saveGeoData } from '../database/layers';
import { storeGeoFeaturesData } from '../database/geoFeatureCollections';

import { storeLocalFileAsBlob, storeFromUrlAsBlob } from '../azureStorage/blobContainer';
import { GeoDataConfigItem } from '../types';

const bbox: any = require('@turf/bbox');

const storeGeoDataToDb = async (fromFile: boolean, data: GeoDataConfigItem, filePath: string) => {
  let geojsonData;
  logger.info(`Clearing database collection ${data.collectionName}`);
  await clearCollection(data.collectionName);
  logger.info(`Loading data from file ${filePath}`);
  if (fromFile) {
    geojsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    const result = await axios.get(data.geoDataUrl, { responseType: 'json' });
    if (result.status !== 200) {
      logger.error(`Failed to fetch geojson data from ${data.geoDataUrl}`);
      return false;
    }
    geojsonData = result.data;
  }
  logger.info(`Creating index on collection...`);
  await createCollection(data.collectionName, undefined, 'bbox');
  logger.info(`Generating bounding boxes for features...`);

  const { features } = geojsonData;
  if (!features || !features.length) {
    logger.info(`No features in file ${filePath}`);
    return;
  }
  const featuresWithBbox = features.map((feature) => {
    if (feature.geometry.type === 'Point') {
      return { ...feature, bbox: feature.geometry };
    }
    const [minX, minY, maxX, maxY] = bbox.default({
      type: 'FeatureCollection',
      name: 'Polygon',
      features: [feature],
    });
    const generatedBBox = [
      [
        [minX, minY],
        [minX, maxY],
        [maxX, maxY],
        [maxX, minY],
        [minX, minY],
      ],
    ];
    return {
      ...feature,
      bbox: { type: 'Polygon', coordinates: generatedBBox },
    };
  });

  logger.info(`Storing features into database...`);
  await storeGeoFeaturesData(data.collectionName, featuresWithBbox);
};

const formatLayerGeoData = async (data: GeoDataConfigItem, dataset: string) => {
  const existing = await getOneLayerGeoData(data.referenceId);
  if (existing) {
    logger.info(`Layer ${data.name} already exists. Skipping...`);
    return false;
  }
  let url;
  if (data.collectionName && data.apiUrl) {
    await createCollection(data.collectionName, undefined, 'geometry');
    url = data.apiUrl;
  }
  if (data.geoDataUrl) {
    logger.info(`Downloading geojson ${data.geoDataUrl} for layer ${data.referenceId}...`);
    if (data.storeToDb) {
      await storeGeoDataToDb(false, data, data.geoDataUrl);
      url = data.apiUrl;
      logger.info(`Layer ${data.name} has new URL for geodata: ${url}`);
    } else {
      const filename = await storeFromUrlAsBlob(data.geoDataUrl, config.azureStorageLayerContainerName);
      if (filename) {
        url = `/api/uploads/geojsons/${filename}`;
        logger.info(`Layer ${data.name} has new URL for geojson: ${url}`);
      }
    }
  } else if (data.geoDataFilename) {
    const filePath = path.join(__dirname, '..', '..', 'data', dataset, 'geoData', data.geoDataFilename);
    const hasFile = fs.existsSync(filePath);
    if (hasFile && data.storeToDb) {
      logger.info(`Storing geodata ${data.geoDataFilename} for layer ${data.referenceId} from file...`);
      await storeGeoDataToDb(true, data, filePath);
      url = data.apiUrl;
      logger.info(`Layer ${data.name} has new URL for geodata: ${url}`);
    } else if (hasFile && !data.storeToDb) {
      logger.info(`Storing geojson ${data.geoDataFilename} for layer ${data.referenceId} from file...`);
      const filename = await storeLocalFileAsBlob(
        filePath,
        data.geoDataFilename,
        config.azureStorageLayerContainerName,
      );
      if (filename) {
        url = `/api/uploads/geojsons/${filename}`;
        logger.info(`Layer ${data.name} has new URL for geojson: ${url}`);
      }
    } else {
      logger.info(`Layer ${data.name} has corrupted or missing geojson file.`);
    }
  }
  const newDataObj = { ...data, geoDataUrl: url, updateDate: Date.now() };
  return newDataObj;
};

const geoDataUpload = async (dataset: string) => {
  if (dataset) {
    let hasFile = false;
    try {
      hasFile = fs.existsSync(path.join(__dirname, '..', '..', 'data', dataset, 'GeoData.yml'));
    } catch (err) {
      logger.error(`GeoData for dataset ${dataset} not found:\n${err}`);
    }
    if (hasFile) {
      const layersGeoData = await yaml.load(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', dataset, 'GeoData.yml'), 'utf8'),
      );
      const savingGeoJsons = layersGeoData.map((item) => formatLayerGeoData(item, dataset));
      let geoDataForDb = await Promise.all([...savingGeoJsons]);
      geoDataForDb = geoDataForDb.filter((item) => item);
      await saveGeoData(geoDataForDb);
      logger.info(`LayerGeoData for dataset ${dataset} successfully saved to database.`);
    } else {
      logger.error(`Data for dataset ${dataset} not found.`);
    }
  } else {
    logger.info('Layer geo data upload: No dataset for data upload specified.');
  }
};
export default geoDataUpload;
