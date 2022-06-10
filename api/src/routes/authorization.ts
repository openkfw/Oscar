import express from 'express';
import httpStatus from 'http-status';

const router = express.Router();

router.get('/', (req, res) => {
  res.send(httpStatus.NO_CONTENT);
});

export default router;
