import fs from 'fs';
import path from 'path';
import Bottleneck from 'bottleneck';
import csv2json from 'csvtojson';

import logger from './config/winston';
import { setupCollections, saveAttributes } from './database/attributes';
import { isNumberInString } from './utils';
import { APIRegionAttribute, AttributesFileConfigItem } from './types';

const limiter = new Bottleneck({
  maxConcurrent: 1,
});

/**
 * Load values from file and store them in database
 * @param  {string} date - specified date for the data in file
 * @param  {string} csvFile - file name of CSV file
 */
const saveAttributesFromFile = async (date: string, csvFile: string) => {
  logger.info(`Saving attributes from file ${csvFile}`);
  const hasFile = fs.existsSync(path.join(__dirname, csvFile));
  if (!hasFile) {
    logger.error(`File not found: ${csvFile}`);
  }
  const attributeData: Array<APIRegionAttribute> = [];

  await csv2json({ delimiter: [',', ';'] })
    .fromFile(path.join(__dirname, csvFile))
    .subscribe((row) => {
      let keys = Object.keys(row);
      if (!keys || keys.length <= 1) {
        logger.error('Failed to parse csv file, please use , or ; as delimiter.');
        return;
      }
      // id for feature in geodata is stored in 'AdminArea' in csv
      if (!keys.includes('AdminArea')) {
        logger.error('Unable to find geo features');
        return;
      }
      keys = keys.filter((key) => key !== 'AdminArea');
      if (!keys.length) {
        logger.info(`No data in file ${csvFile}`);
      }
      const geoFeature = row.AdminArea;
      keys.forEach((key) => {
        const value = row[key];
        if (value || value === 0) {
          const item: APIRegionAttribute = {
            date,
            featureId: geoFeature,
            attributeId: key,
            value,
          };
          if (isNumberInString(value) !== null) {
            // item.valueNumber = Number.parseFloat(value);
            item.valueType = 'number';
          } else {
            item.valueType = 'text';
          }
          attributeData.push(item);
        }
      });
    })
    .on('error', (error) => {
      logger.error(`Failed to parse csv file:\n${error}`);
    });

  if (attributeData.length) {
    logger.info(`Created ${attributeData.length} items from file ${csvFile}`);
    await saveAttributes(attributeData);
    logger.info(`New data from file ${csvFile} successfully stored in database.`);
  } else {
    logger.info(`No values in file ${csvFile}`);
  }
};

/**
 * Uploads attributes from folder with dataset
 * @param  {string} dataSet - name of folder with dataset
 */
// eslint-disable-next-line import/prefer-default-export
export const uploadAttributes = async (dataSet: string) => {
  await setupCollections();

  if (dataSet) {
    const hasFolder = fs.existsSync(path.join(__dirname, '..', 'data', dataSet, 'attributes'));
    const hasFile = fs.existsSync(path.join(__dirname, '..', 'data', dataSet, 'attributes', 'index.js'));
    if (hasFolder && hasFile) {
      logger.info(`Saving attributes for dataset ${dataSet}`);
      // eslint-disable-next-line
      const uploadData: Array<AttributesFileConfigItem> = require(`../data/${dataSet}/attributes/index.js`);
      const uploads = uploadData.map((data) =>
        limiter.schedule(() =>
          saveAttributesFromFile(data.date, path.join('..', 'data', dataSet, 'attributes', data.csvFileName)),
        ),
      );
      await Promise.all([...uploads]);
      logger.info(`Attribute data for dataset ${dataSet} successfully uploaded.`);
    } else {
      logger.error(`Attribute data for dataset ${dataSet} not found.`);
    }
  } else {
    logger.info('Layer attributes upload: No dataset for data upload specified.');
  }
};
