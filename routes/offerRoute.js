const express = require('express');

const router = express.Router();

const {
  createOffer,
  getOffers,
  deleteOffer,
} = require('../controllers/offerController');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

router.
  route('/')
  .post(isAuth, allowedTo('ADMIN'), createOffer)
  .get(getOffers);

router
  .route('/:id')
  .delete(isAuth, allowedTo('ADMIN'), deleteOffer);

module.exports = router;
