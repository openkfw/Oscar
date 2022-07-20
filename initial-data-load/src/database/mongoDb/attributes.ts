import mongoose from 'mongoose';
import logger from '../../config/winston';

import { createRegularIndex, createGeoDataIndex } from '.';
import { ATTRIBUTES_COLLECTION_NAME, POINT_ATTRIBUTES_COLLECTION_NAME } from './constants';
import { APIRegionAttribute } from '../../types';

const createIndexesForAttributesCollections = async () => {
  await createRegularIndex(ATTRIBUTES_COLLECTION_NAME, { date: -1, featureId: 1, attributeId: 1 });
  await createRegularIndex(ATTRIBUTES_COLLECTION_NAME, { date: 1, featureId: 1, attributeId: 1 });
  await createRegularIndex(ATTRIBUTES_COLLECTION_NAME, { date: -1 });
  await createGeoDataIndex(POINT_ATTRIBUTES_COLLECTION_NAME);
  await createRegularIndex(POINT_ATTRIBUTES_COLLECTION_NAME, { 'properties.attributeId': 1 });
  await createRegularIndex(POINT_ATTRIBUTES_COLLECTION_NAME, { 'properties.updatedDate': -1 });
};

const saveAttributes = async (data: Array<APIRegionAttribute>) => {
  // will not fit the types soon, needs to map from API format to mongoDb
  if (data.length) {
    const operations = data.map((itemData) => {
      const dbData: any = itemData;
      if (dbData.valueType === 'number') {
        dbData.valueNumber = Number.parseFloat(dbData.value);
      } else if (dbData.valueType === 'text') {
        dbData.valueString = dbData.value;
      }
      delete dbData.value;
      delete dbData.valueType;
      return {
        replaceOne: {
          filter: {
            date: itemData.date,
            featureId: itemData.featureId,
            attributeId: itemData.attributeId,
          },
          replacement: dbData,
          upsert: true,
        },
      };
    });
    // could not find correct type for BulkWriteOptions
    await mongoose.connection.db.collection(ATTRIBUTES_COLLECTION_NAME).bulkWrite(operations, { strict: false } as any);
  } else {
    logger.info(`No data for storing found.`);
  }
};

export default { setupCollections: createIndexesForAttributesCollections, saveAttributes };
