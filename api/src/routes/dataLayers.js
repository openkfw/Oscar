const express = require('express');
const swaggerValidation = require('../config/swagger');
const { forwardError } = require('../helpers/utils');
const { getMapLayersWithGeoData } = require('../database/layers');

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    const items = await getMapLayersWithGeoData();
    res.send(items);
  }),
);

module.exports = router;
