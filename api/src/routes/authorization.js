const express = require('express');
const httpStatus = require('http-status');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(httpStatus.NO_CONTENT);
});

module.exports = router;
