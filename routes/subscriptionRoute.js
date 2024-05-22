const express = require('express');

const {
  createSubscription,
} = require('../controllers/subscriptionController');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(isAuth, allowedTo('TOURIST'), createSubscription);

module.exports = router;
