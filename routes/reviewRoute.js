const express = require('express');

const {
  createOpportunityReview,
  deleteOpportunityReview,
} = require('../controllers/reviewController');

const {
  createOpportunityReviewValidator,
  deleteOpportunityReviewValidator,
} = require('../utils/validators/reviewValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(isAuth, allowedTo('TOURIST'), createOpportunityReviewValidator, createOpportunityReview)
  .delete(isAuth, allowedTo('TOURIST'), deleteOpportunityReviewValidator, deleteOpportunityReview);

module.exports = router;
