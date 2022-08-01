import express from 'express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import swaggerValidation from '../config/swagger';
import utils from '../helpers/utils';
import logger from '../config/winston';
import config from '../config/config';

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
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

export default router;
