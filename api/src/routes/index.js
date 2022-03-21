const express = require('express');
const dataLayers = require('./dataLayers');
const attributes = require('./attributes');
const pointAttributes = require('./pointAttributes');
const uploads = require('./uploads');
const authorization = require('./authorization');
const config = require('./config');

const router = express.Router();

router.use('/dataLayers', dataLayers);
router.use('/staticLayers', dataLayers);
router.use('/attributes', attributes);
router.use('/pointAttributes', pointAttributes);
router.use('/uploads', uploads);
router.use('/authorization', authorization);
router.use('/config', config);

module.exports = router;
