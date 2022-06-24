import { ATTRIBUTES_COLLECTION_NAME } from './constants';
import { getDb } from './index';

/**
 * Find latest date for data for given attributeId
 * @param  {string} attributeId
 */
export const getLatestAttributeDate = async (attributeId: string) => {
  const db = getDb();

  const items = await db
    .select('*')
    .from(ATTRIBUTES_COLLECTION_NAME)
    .where({
      attribute_id: attributeId,
    })
    .orderBy('date_iso', 'desc')
    .limit(1);
  if (items.length) {
    return items[0].date_iso;
  }
};
export default { getLatestAttributeDate };
