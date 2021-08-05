import { Attribute, ItemFromFile } from '../types';
import { FEATUREID_KEY, ATTRIBUTEID_KEYS, DATE_KEY } from '../constants'; // eslint-disable-line

/**
 * Process data and return them in correct format to store into database
 * @param  {Array<ItemFromFile>} data - array with data from file
 * @returns {Array<Attribute>} - array of attributes
 */
const dataParser = (data: Array<ItemFromFile>): Array<Attribute> => {
  const date = new Date().toISOString();
  if (!FEATUREID_KEY) {
    throw Error('Missing featureId setting.');
  }
  const rows = [];
  let attributeIdToSave = [];
  if (ATTRIBUTEID_KEYS && ATTRIBUTEID_KEYS.length) {
    attributeIdToSave = ATTRIBUTEID_KEYS;
  } else {
    attributeIdToSave = Object.keys(data[0])
      .filter((key) => key !== FEATUREID_KEY && key !== DATE_KEY)
      .map((key) => ({ key }));
  }
  attributeIdToSave.forEach((keyValues) => {
    const newRows = data.map((item) => ({
      date: DATE_KEY ? item[DATE_KEY] : date,
      featureId: item[FEATUREID_KEY],
      attributeId: keyValues.attributeId || keyValues.key,
      valueNumber: Number.parseFloat(item[keyValues.key]),
    }));
    rows.push(...newRows);
  });

  return rows;
};
export default dataParser;
