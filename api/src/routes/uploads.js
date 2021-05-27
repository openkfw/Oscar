const express = require('express');
const swaggerValidation = require('../config/swagger');
const { forwardError } = require('../helpers/utils');
const { downloadBlobToResponse } = require('../azureStorage/upload');
const { azureStorageLayerContainerName } = require('../config/config');

const router = express.Router();

router.get(
  '/geojsons/:fileName',
  swaggerValidation.validate,
  forwardError(async (req, res) => {
    const { fileName } = req.params;

    await downloadBlobToResponse(azureStorageLayerContainerName, fileName, res);
  }),
);

module.exports = router;
