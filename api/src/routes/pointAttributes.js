const express = require('express');
const swaggerValidation = require('../config/swagger');
const { forwardError } = require('../helpers/utils');

const { getPointAttributes } = require('../actions/pointAttributesActions');

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    const { bottomLeft, topRight, attributeId } = req.query;

    const attributes = await getPointAttributes(attributeId, bottomLeft, topRight);

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

module.exports = router;
