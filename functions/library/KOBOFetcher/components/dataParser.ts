import { EXCEPT_KEYS } from '../constants';
import { Attribute, Survey } from '../types';

/**
 * Process data and return them in correct format to store into database
 * @param  {Array<ItemFromFile>} data - array with data from file
 * @returns {Array<Attribute>} - array of attributes
 */
const dataParser = (data: Array<any>, survey: Survey): Array<Attribute> => {
  const parsedData = data.map((item) => {
    const latLong = item[survey.keyWithCoordinates]
      .split(' ')
      .slice(0, 2)
      .map((coord) => Number.parseFloat(coord));
    const coordinates = [latLong[1], latLong[0]];

    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates,
      },
      properties: {
        KOBO_uuid: item._uuid,
        createdDate: item._submission_time,
        updatedDate: item.end,
        attributeId: survey.name,
      },
    };
    if (survey.selectedKeys && survey.selectedKeys.length) {
      survey.selectedKeys.forEach((key) => {
        feature.properties[key.key || key.KOBO_question] = item[key.KOBO_question];
      });
    } else {
      let keysForSaving = Object.keys(item);
      keysForSaving = keysForSaving.filter((key) => !EXCEPT_KEYS.includes(key));
      keysForSaving.forEach((key) => {
        feature.properties[key] = item[key];
      });
    }
    return feature;
  });
  return parsedData;
};
export default dataParser;
