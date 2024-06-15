const express = require('express');

const {
  createPlaceReview,
  createUserReview,
  deletePlaceReview,
  deleteUserReview,
} = require('../controllers/reviewController');

const {
  createPlaceReviewValidator,
  createUserReviewValidator,
  deletePlaceReviewValidator,
  deleteUserReviewValidator,
} = require('../utils/validators/reviewValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.rootReviewRouter = {
  createPlaceReview: [
    isAuth, allowedTo('TOURIST'), createPlaceReviewValidator, createPlaceReview,
  ],
  createUserReview: [
    isAuth, allowedTo('TOURIST', 'HOST', 'ADMIN'), createUserReviewValidator, createUserReview,
  ],
  deletePlaceReview: [
    isAuth, allowedTo('TOURIST'), deletePlaceReviewValidator, deletePlaceReview,
  ],
  deleteUserReview: [
    isAuth, allowedTo('TOURIST', 'HOST', 'ADMIN'), deleteUserReviewValidator, deleteUserReview,
  ],
};

module.exports = router;
