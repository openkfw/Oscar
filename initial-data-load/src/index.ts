import config from './config/config';
import logger from './config/winston';

// import mapLayerDataUpload from './mapLayers';
import { uploadAttributes } from './attributes';

const uploads = async () => {
  // if (config.uploadDataTypes.includes('mapLayers')) {
  //   await mapLayerDataUpload(config.dataset || config.country);
  // }

  if (config.uploadDataTypes.includes('attributes')) {
    logger.info('Uploading sample attributes...');
    await uploadAttributes(config.dataset || config.country);
  }
};

export default uploads;
