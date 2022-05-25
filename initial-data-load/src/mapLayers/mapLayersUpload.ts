import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import logger from '../config/winston';
import { saveMapLayers } from '../database/layers';
import { MapLayerConfigItem } from '../types';

/**
 * Uploading map layers in database from config file
 * @param  {string} dataset - name of folder with dataset
 */
const uploadMapLayers = async (dataset: string) => {
  if (dataset) {
    const filePath = path.join(__dirname, '..', '..', 'data', dataset, 'MapLayers.yml');
    const hasFile = fs.existsSync(filePath);
    if (hasFile) {
      const mapLayers: Array<MapLayerConfigItem> = await yaml.load(fs.readFileSync(filePath, 'utf8'));
      await saveMapLayers(mapLayers);
    } else {
      logger.error(`Data for dataset ${dataset} not found.`);
    }
  } else {
    logger.info('Map layer upload: No dataset for data upload specified.');
  }

  logger.info('Finished map layers loading.');
};

export default uploadMapLayers;
