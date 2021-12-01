const express = require('express');
const swaggerValidation = require('../config/swagger');
const { forwardError } = require('../helpers/utils');
const {
  getLatestAttributes,
  countAttributes,
  getFilteredAttributes,
  getAvailableDates,
  getUniqueFeatureIds
} = require('../models/attributeModel');
const logger = require('../config/winston');

const router = express.Router();
const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

router.get(
  '/',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    const { limit, offset, dateStart, dateEnd, attributeId, attributeIdCategory, featureId, latestValues } = req.query;

    let items = [];

    if (latestValues) {
      items = await getLatestAttributes(attributeId, attributeIdCategory).catch((e) =>
        logger.error(`Error: ${e.message}`),
      );
    } else {
      const dataLimit = Number.parseInt(limit, 10) || DEFAULT_LIMIT;
      const dataOffset = Number.parseInt(offset, 10) || DEFAULT_OFFSET;
      const count = await countAttributes(attributeId, attributeIdCategory, featureId, dateStart, dateEnd);
      res.set('X-Total-Count', count);
      items = await getFilteredAttributes(
        attributeId,
        attributeIdCategory,
        featureId,
        dateStart,
        dateEnd,
        dataLimit,
        dataOffset,
      ).catch((e) => logger.error(`Error: ${e.message}`));
    }
    res.send(items);
  }),
);

router.get(
  '/:attributeId/availableDates',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    let items = [];
    items = await getAvailableDates(req.params.attributeId);
    res.send(items);
  }),
);

router.get('/:attributeId/uniqueFeatures',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    let items = [];
    items = await getUniqueFeatureIds(req.params.attributeId)
    res.send(items)
  }));

module.exports = router;
