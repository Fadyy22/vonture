const express = require('express');

const {
  createOpportunityReview,
} = require('../controllers/reviewController');

const {
  createOpportunityReviewValidator,
} = require('../utils/validators/reviewValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(isAuth, allowedTo('TOURIST'), createOpportunityReviewValidator, createOpportunityReview);

module.exports = router;
