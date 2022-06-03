import { getDb } from '.';
import { GeoJson } from '../../types';

export const storeFeatures = (tableName: string, data: GeoJson, db = getDb()) => db.insert(data).into(tableName);

export default { storeFeatures };
