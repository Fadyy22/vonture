const express = require('express');

const {
  getSubscriptionCheckout,
} = require('../controllers/subscriptionController');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .get('/:id/subscribe', isAuth, allowedTo('TOURIST'), getSubscriptionCheckout);

module.exports = router;
