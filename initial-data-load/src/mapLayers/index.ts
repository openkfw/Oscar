import logger from '../config/winston';
import mapLayersUpload from './mapLayersUpload';
import geoDataUpload from './layersGeoDataUpload';
import { setupCollections } from '../database/layers';

export default async (dataset: string) => {
  await setupCollections();
  logger.info('Uploading geo data for map layers...');
  await geoDataUpload(dataset);

  logger.info('Uploading map layers data...');
  await mapLayersUpload(dataset);
};
