const express = require('express');
const swaggerValidation = require('../config/swagger');
const { forwardError } = require('../helpers/utils');

const { getPointAttributes, getUniqueValues } = require('../database/pointAttributes');

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    const { bottomLeft, topRight, attributeId, dateStart, dateEnd, lastDate } = req.query;

    const attributes = await getPointAttributes(attributeId, bottomLeft, topRight, dateStart, dateEnd, lastDate);

    if (attributes && attributes.length) {
      res.send({
        type: 'FeatureCollection',
        name: attributeId || 'pointAttributes',
        features: attributes.map((item) => ({ ...item, id: item._id })),
      });
      return;
    }
    res.send({
      type: 'FeatureCollection',
      name: attributeId || 'pointAttributes',
      features: [],
    });
  }),
);

router.get(
  '/:attributeId/unique/:property',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    let items = [];
    items = await getUniqueValues(req.params.attributeId, req.params.property);
    res.send(items);
  }),
);

module.exports = router;
