import mongoose from 'mongoose';

import { ATTRIBUTES_COLLECTION_NAME } from './constants';

/**
 * Find latest date for data for given attributeId
 * @param  {string} attributeId
 */
export const getLatestAttributeDate = async (attributeId) => {
  const { connection } = mongoose;
  const { db } = connection;

  const date = await db
    .collection(ATTRIBUTES_COLLECTION_NAME)
    .find({ attributeId })
    .sort({ date: -1 })
    .limit(1)
    .toArray();
  if (date.length) {
    return date[0].date;
  }
};

export default { getLatestAttributeDate };
