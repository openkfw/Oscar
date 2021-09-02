const express = require('express');
const mongoose = require('mongoose');
const swaggerValidation = require('../config/swagger');
const { forwardError } = require('../helpers/utils');
const { POINT_ATTRIBUTES_COLLECTION } = require('../dbSchemas/pointAttributeSchema');

const { filterCoordinates } = require('../helpers/filters');

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    const { bottomLeft, topRight, attributeId } = req.query;
    const { connection } = mongoose;
    const { db } = connection;

    let filter = {};
    if (bottomLeft && topRight) {
      filter = filterCoordinates(filter, bottomLeft, topRight);
    }
    if (attributeId) {
      filter['properties.attributeId'] = attributeId;
    }

    const attributes = await db.collection(POINT_ATTRIBUTES_COLLECTION).find(filter).toArray();

    if (attributes && attributes.length) {
      res.send({
        type: 'FeatureCollection',
        name: attributeId || POINT_ATTRIBUTES_COLLECTION,
        features: attributes.map((item) => ({ ...item, id: item._id })),
      });
      return;
    }
    res.send({
      type: 'FeatureCollection',
      name: attributeId || POINT_ATTRIBUTES_COLLECTION,
      features: [],
    });
  }),
);

module.exports = router;
