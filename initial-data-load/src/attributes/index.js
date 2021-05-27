const fs = require('fs');
const path = require('path');
const Bottleneck = require('bottleneck');

const { createIndex, addAttributes } = require('./db');
const logger = require('../config/winston');

const limiter = new Bottleneck({
  maxConcurrent: 1,
});

const uploadAttributes = async (country) => {
  await createIndex();

  if (country) {
    const hasFolder = fs.existsSync(path.join(__dirname, '..', '..', 'data', country, 'attributes'));
    const hasFile = fs.existsSync(path.join(__dirname, '..', '..', 'data', country, 'attributes', 'index.js'));
    if (hasFolder && hasFile) {
      logger.info(`Saving attributes for country ${country}`);
      // eslint-disable-next-line
      const uploadData = require(`../../data/${country}/attributes/index.js`);
      const uploads = uploadData.map((data) =>
        limiter.schedule(() =>
          addAttributes(data.date, path.join('..', '..', 'data', country, 'attributes', data.csvFileName)),
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
