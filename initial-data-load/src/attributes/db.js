const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csv2json = require('csvtojson');

const logger = require('../config/winston');
const { isNumberInString } = require('../utils');

const { ATTRIBUTES_COLLECTION_NAME, POINT_ATTRIBUTES_COLLECTION_NAME } = require('../constants');

const createIndex = async () => {
  const { db } = mongoose.connection;
  await db.collection(ATTRIBUTES_COLLECTION_NAME).createIndex({ date: -1, featureId: 1, attributeId: 1 });
  await db.collection(ATTRIBUTES_COLLECTION_NAME).createIndex({ date: 1, featureId: 1, attributeId: 1 });
  await db.collection(ATTRIBUTES_COLLECTION_NAME).createIndex({ date: -1 });
  await db.collection(POINT_ATTRIBUTES_COLLECTION_NAME).createIndex({ geometry: '2dsphere' });
  await db.collection(POINT_ATTRIBUTES_COLLECTION_NAME).createIndex({ 'properties.attributeId': 1 });
  await db.collection(POINT_ATTRIBUTES_COLLECTION_NAME).createIndex({ 'properties.updatedDate': -1 });
};

const addAttributes = async (date, csvFile) => {
  logger.info(`Saving attributes from file ${csvFile}`);
  const hasFile = fs.existsSync(path.join(__dirname, csvFile));
  if (!hasFile) {
    logger.error(`File not found: ${csvFile}`);
    return;
  }
  const operations = [];

  await csv2json({ delimiter: [',', ';'] })
    .fromFile(path.join(__dirname, csvFile))
    .subscribe((row) => {
      let keys = Object.keys(row);
      if (!keys || keys.length <= 1) {
        logger.error('Failed to parse csv file, please use , or ; as delimiter.');
        return;
      }
      // id for feature in geojson is stored in 'AdminArea'
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
          const operation = {
            replaceOne: {
              filter: {
                date,
                featureId: geoFeature,
                attributeId: key,
              },
              replacement: {
                date,
                featureId: geoFeature,
                attributeId: key,
              },
              upsert: true,
            },
          };
          if (isNumberInString(value) !== null) {
            operation.replaceOne.replacement.valueNumber = Number.parseFloat(value);
          } else {
            operation.replaceOne.replacement.valueString = value;
          }
          operations.push(operation);
        }
      });
    })
    .on('error', (error) => {
      logger.error(`Failed to parse csv file:\n${error}`);
    });
  if (operations.length) {
    await mongoose.connection.db.collection(ATTRIBUTES_COLLECTION_NAME).bulkWrite(operations, { strict: false });
    logger.info(`New data from file ${csvFile} successfully stored in collection ${ATTRIBUTES_COLLECTION_NAME}.`);
  } else {
    logger.info(`No values in file ${csvFile}`);
  }
};

module.exports = { createIndex, addAttributes };
