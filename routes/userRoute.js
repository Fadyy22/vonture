const express = require('express');

const {
  getMyProfile,
} = require('../controllers/userController');

const placeRouter = require('./placeRoute');

const isAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/:id/places', placeRouter);

router
  .route('/me')
  .get(isAuth, getMyProfile);

module.exports = router;
