const fs = require('fs');
const path = require('path');
const Bottleneck = require('bottleneck');
const csv2json = require('csvtojson');

const logger = require('./config/winston');
const { setupCollections, saveAttributes } = require('./database/attributes');
const { isNumberInString } = require('./utils');

const limiter = new Bottleneck({
  maxConcurrent: 1,
});

const saveAttributesFromFile = async (date, csvFile) => {
  logger.info(`Saving attributes from file ${csvFile}`);
  const hasFile = fs.existsSync(path.join(__dirname, csvFile));
  if (!hasFile) {
    logger.error(`File not found: ${csvFile}`);
  }
  const attributeData = [];

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
          const item = {
            date,
            featureId: geoFeature,
            attributeId: key,
          };
          if (isNumberInString(value) !== null) {
            item.valueNumber = Number.parseFloat(value);
          } else {
            item.valueString = value;
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

const uploadAttributes = async (country) => {
  await setupCollections();

  if (country) {
    const hasFolder = fs.existsSync(path.join(__dirname, '..', 'data', country, 'attributes'));
    const hasFile = fs.existsSync(path.join(__dirname, '..', 'data', country, 'attributes', 'index.js'));
    if (hasFolder && hasFile) {
      logger.info(`Saving attributes for country ${country}`);
      // eslint-disable-next-line
      const uploadData = require(`../data/${country}/attributes/index.js`);
      const uploads = uploadData.map((data) =>
        limiter.schedule(() =>
          saveAttributesFromFile(data.date, path.join('..', 'data', country, 'attributes', data.csvFileName)),
        ),
      );
      await Promise.all([...uploads]);
      logger.info(`Attribute data for country ${country} successfully uploaded.`);
    } else {
      logger.error(`Data for country ${country} not found.`);
    }
  } else {
    logger.info('Layer attributes upload: No country for data upload specified.');
  }
};

module.exports = { uploadAttributes };
