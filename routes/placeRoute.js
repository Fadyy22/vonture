const express = require('express');

const {
  createPlace,
} = require('../controllers/placeController');

const {
  createPlaceValidator,
} = require('../utils/validators/placeValidator');

const isAuth = require('../middlewares/authMiddleware');
const allowedTo = require('../middlewares/allowedToMiddleware');

const router = express.Router();

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createPlaceValidator, createPlace);

module.exports = router;
