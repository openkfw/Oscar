const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerValidation = require('../config/swagger');
const { forwardError } = require('../helpers/utils');
const logger = require('../config/winston');
const config = require('../config/config');

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    let hasFile = false;
    const fileName = config.env === 'test' ? 'configTest.yml' : 'config.yml';
    try {
      hasFile = fs.existsSync(path.join(__dirname, '..', '..', 'data', 'config', fileName));
    } catch (err) {
      logger.error(`UI configuration not found:\n${err}`);
      return res.sendStatus(404);
    }
    if (hasFile) {
      const countryConfig = await yaml.load(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'config', fileName), 'utf8'),
      );
      res.send(countryConfig);
    } else {
      logger.error('UI configuration not found');
      return res.sendStatus(404);
    }
  }),
);

module.exports = router;
