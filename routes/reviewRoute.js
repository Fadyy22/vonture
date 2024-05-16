const express = require('express');

const {
  createPlaceReview,
  deleteOpportunityReview,
} = require('../controllers/reviewController');

const {
  createPlaceReviewValidator,
  deleteOpportunityReviewValidator,
} = require('../utils/validators/reviewValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(isAuth, allowedTo('TOURIST'), createPlaceReviewValidator, createPlaceReview)
  .delete(isAuth, allowedTo('TOURIST'), deleteOpportunityReviewValidator, deleteOpportunityReview);

module.exports = router;
