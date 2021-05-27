const express = require('express');
const staticLayers = require('./staticLayers');
const attributes = require('./attributes');
const uploads = require('./uploads');
const authorization = require('./authorization');
const config = require('./config');

const router = express.Router();

router.use('/staticLayers', staticLayers);
router.use('/attributes', attributes);
router.use('/uploads', uploads);
router.use('/authorization', authorization);
router.use('/config', config);

module.exports = router;
