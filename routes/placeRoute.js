const express = require('express');

const {
  createPlace,
} = require('../controllers/placeController');

const isAuth = require('../middlewares/authMiddleware');
const allowedTo = require('../middlewares/allowedToMiddleware');

const router = express.Router();

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createPlace);

module.exports = router;
