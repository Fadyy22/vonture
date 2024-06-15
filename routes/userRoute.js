const express = require('express');

const {
  getAllUsers,
  getMyProfile,
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

module.exports = router;
