const express = require('express');

const {
  createOpportunity,
} = require('../controllers/opportunityController');

const isAuth = require('../middlewares/authMiddleware');
const allowedTo = require('../middlewares/allowedToMiddleware');

const router = express.Router();

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createOpportunity);

module.exports = router;
