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
      let mapLayers: Array<MapLayerConfigItem> = await yaml.load(fs.readFileSync(filePath, 'utf8'));
      // modifying various old config  structures to current
      mapLayers = mapLayers.map((lyr) => {
        const layer = lyr;
        if (!lyr.attributeData) {
          layer.attributeData = { attributeId: lyr.attribute };
        }
        if (layer.timeseries !== undefined) {
          logger.info(
            `DeprecationWarning: 'timeseries' key on the top level is deprecated. Move 'timeseries' key in 'layerOptions' key in ${layer.referenceId} layer in mapLayers config.`,
          );
          layer.layerOptions = { ...layer.layerOptions, timeseries: layer.timeseries };
          delete layer.timeseries;
        }
        return layer;
      });
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
