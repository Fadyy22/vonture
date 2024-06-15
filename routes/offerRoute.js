const express = require('express');

const router = express.Router();

const {
  getOffers,
} = require('../controllers/offerController');

router.
  route('/')
  .get(getOffers);

module.exports = router;
