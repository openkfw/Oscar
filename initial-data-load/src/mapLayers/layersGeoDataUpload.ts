import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import axios from 'axios';
import Joi from '@hapi/joi';
import config from '../config/config';
import logger from '../config/winston';

import { createOrClearCollection, checkIfCollectionExists, createCollection } from '../database';
import { getOneLayerGeoData, saveGeoData } from '../database/layers';
import { storeGeoFeaturesData } from '../database/geoFeatureCollections';

import { storeLocalFileAsBlob, storeFromUrlAsBlob } from '../azureStorage/blobContainer';
import { GeoDataConfigItem, GeoJson } from '../types';
import { geoDataConfig } from './joiSchemas';

const bbox: any = require('@turf/bbox');

/**
 * Storing data in database table for this specific data
 * @param  {boolean} fromFile
 * @param  {GeoDataConfigItem} data
 * @param  {string} filePath
 */
const storeGeoDataToDb = async (fromFile: boolean, data: GeoDataConfigItem, filePath: string, tableName: string) => {
  let geojsonData: GeoJson;
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
  await storeGeoFeaturesData(tableName, featuresWithBbox);
};

const handleGeoDataUrl = async (data: GeoDataConfigItem) => {
  // database table defined in new config version
  if (data.storeToTable) {
    await storeGeoDataToDb(false, data, data.geoDataUrl, data.storeToTable);
    logger.info(`Data for layer ${data.name} stored in database table ${data.storeToTable}`);
    return;
  }
  // deprecated old config version
  if (data.storeToDb && data.collectionName) {
    await storeGeoDataToDb(false, data, data.geoDataUrl, data.collectionName);
    logger.info(`Data for layer ${data.name} stored in new/cleared database table ${data.collectionName}`);
    return;
  }
  // no database table defined, data is stored as file
  const filename = await storeFromUrlAsBlob(data.geoDataUrl, config.azureStorageLayerContainerName);
  if (filename) {
    const url = `/api/uploads/geojsons/${filename}`;
    logger.info(`Data for layer ${data.name} stored in file storage.`);
    logger.info(`Layer ${data.name} has new URL for geojson: ${url}`);
    return url;
  }
};

const handleGeoDataFilename = async (data: GeoDataConfigItem, dataset: string) => {
  const filePath = path.join(__dirname, '..', '..', 'data', dataset, 'geoData', data.geoDataFilename);
  const hasFile = fs.existsSync(filePath);

  if (!hasFile) {
    logger.info(`Layer ${data.name} has corrupted or missing geojson file.`);
    return;
  }
  if (data.storeToTable) {
    logger.info(`Storing geodata ${data.geoDataFilename} for layer ${data.referenceId} from file...`);
    await storeGeoDataToDb(true, data, filePath, data.storeToTable);
    return;
  }
  if (data.storeToDb && data.collectionName) {
    // deprecated
    logger.info(`Storing geodata ${data.geoDataFilename} for layer ${data.referenceId} from file...`);
    await storeGeoDataToDb(true, data, filePath, data.collectionName);
    return;
  }
  logger.info(`Storing geojson ${data.geoDataFilename} for layer ${data.referenceId} from file...`);
  const filename = await storeLocalFileAsBlob(filePath, data.geoDataFilename, config.azureStorageLayerContainerName);
  if (filename) {
    const url = `/api/uploads/geojsons/${filename}`;
    logger.info(`Layer ${data.name} has new URL for geojson: ${url}`);
    return url;
  }
};

/**
 * Process single geoData item in config file, store data in file storage or database
 * @param  {GeoDataConfigItem} data - configuration of single geoData item
 * @param  {string} dataset - name of dataset for referencing file, in case data are stored in file in dataset folder
 * @returns item in format for database
 */
const formatLayerGeoData = async (data: GeoDataConfigItem, dataset: string) => {
  const existing = await getOneLayerGeoData(data.referenceId);
  if (existing) {
    logger.info(`Layer ${data.name} already exists. Skipping...`);
    return false;
  }
  let url;

  if (data.createTable) {
    logger.info(`Creating or clearing collection for geo data...`);
    await createOrClearCollection(data.createTable, undefined, 'bbox');
  } else if (data.storeToTable) {
    logger.info(`Checking if collection for geo data exists and creating it if not...`);
    const exists = await checkIfCollectionExists(data.storeToTable);
    if (!exists) {
      await createCollection(data.storeToTable, undefined, 'bbox');
    }
  }
  // deprecated
  if (data.storeToDb && data.collectionName) {
    logger.info(`Creating or clearing collection for geo data...`);
    logger.info(`"storeToDb" and "collectionName" deprecated. Use "createTable" and "storeToTable" keys.`);
    await createOrClearCollection(data.collectionName, undefined, 'bbox');
  }

  // data has url link to publicly available data
  if (data.geoDataUrl) {
    url = await handleGeoDataUrl(data);
  } else if (data.geoDataFilename) {
    // data is stored in file in dataset folder
    url = await handleGeoDataFilename(data, dataset);
  }
  const newDataObj = { ...data, geoDataUrl: url || data.apiUrl, updateDate: Date.now() };
  return newDataObj;
};

/**
 * Load geodata settings and intial data from specified dataset in data folder
 * @param  {string} dataset - name of dataset in data
 */
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
      try {
        Joi.assert(layersGeoData, geoDataConfig);
      } catch (error) {
        logger.error(`GeoData.yml validation failed, data might not be loaded correctly:\n ${error}`);
      }
      const savingGeoJsons = layersGeoData.map((item) => formatLayerGeoData(item, dataset));
      let geoDataForDb: Array<GeoDataConfigItem> = await Promise.all([...savingGeoJsons]);
      geoDataForDb = geoDataForDb.filter((item) => item);
      if (geoDataForDb.length) {
        await saveGeoData(geoDataForDb);
        logger.info(`LayerGeoData for dataset ${dataset} successfully saved to database.`);
      } else {
        logger.info(`No new layerGeoData from dataset ${dataset}`);
      }
    } else {
      logger.error(`Data for dataset ${dataset} not found.`);
    }
  } else {
    logger.info('Layer geo data upload: No dataset for data upload specified.');
  }
};
export default geoDataUpload;
