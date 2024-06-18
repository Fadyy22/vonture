const express = require('express');

const {
  getAllUsers,
  getMyProfile,
  getUserProfile,
} = require('../controllers/userController');

const placeRouter = require('./placeRoute');
const reviewRouter = require('./reviewRoute');

const isAuth = require('../middlewares/authMiddleware');

const allowedTo = require('../middlewares/allowedToMiddleware');

const router = express.Router();

router.use('/:id/places', placeRouter);
router.post('/:id/reviews', reviewRouter.rootReviewRouter.createUserReview);
router.delete('/:id/reviews', reviewRouter.rootReviewRouter.deleteUserReview);

router
  .route('/')
  .get(isAuth, allowedTo('ADMIN'), getAllUsers);

router
  .route('/me')
  .get(isAuth, getMyProfile);

router
  .route('/:id')
  .get(getUserProfile);

module.exports = router;
