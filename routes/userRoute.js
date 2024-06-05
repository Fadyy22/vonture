const express = require('express');

const {
  getMyProfile,
} = require('../controllers/userController');

const isAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/me')
  .get(isAuth, getMyProfile);

module.exports = router;
