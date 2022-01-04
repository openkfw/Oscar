const express = require('express');
const staticLayers = require('./staticLayers');
const featureAttributes = require('./featureAttributes');
const pointAttributes = require('./pointAttributes');
const uploads = require('./uploads');
const authorization = require('./authorization');
const config = require('./config');

const router = express.Router();

router.use('/staticLayers', staticLayers);
router.use('/featureAttributes', featureAttributes);
router.use('/pointAttributes', pointAttributes);
router.use('/uploads', uploads);
router.use('/authorization', authorization);
router.use('/config', config);

module.exports = router;
