const express = require('express');
const swaggerValidation = require('../config/swagger');
const { forwardError } = require('../helpers/utils');
const { getAttributes, getAvailableDates, getUniqueFeatureIds } = require('../actions/attributes');

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    const { limit, offset, dateStart, dateEnd, attributeId, attributeIdCategory, featureId, latestValues } = req.query;

    const { items, count } = await getAttributes(
      { attributeId, attributeIdCategory, featureId, dateStart, dateEnd, latestValues },
      { limit, offset },
    );
    res.set('X-Total-Count', count);

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

router.get(
  '/:attributeId/uniqueFeatures',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    let items = [];
    items = await getUniqueFeatureIds(req.params.attributeId);
    res.send(items);
  }),
);

module.exports = router;
