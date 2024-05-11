const express = require('express');

const {
  createOpportunityReview,
  createUserReview,
  deleteOpportunityReview,
} = require('../controllers/reviewController');

const {
  createOpportunityReviewValidator,
  createUserReviewValidator,
  deleteOpportunityReviewValidator,
} = require('../utils/validators/reviewValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(isAuth, allowedTo('TOURIST'), createOpportunityReviewValidator, createOpportunityReview)
  .delete(isAuth, allowedTo('TOURIST'), deleteOpportunityReviewValidator, deleteOpportunityReview);

router
  .route('/user/:id/review')
  .post(isAuth, allowedTo('TOURIST', 'HOST'), createUserReviewValidator, createUserReview);

module.exports = router;
