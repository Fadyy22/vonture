const express = require('express');

const {
  createPlace,
  deletePlace,
} = require('../controllers/placeController');

const {
  createPlaceValidator,
  deletePlaceValidator,
} = require('../utils/validators/placeValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const opportunityRouter = require('./opportunityRoute');

const router = express.Router();

router.use('/:id/opportunities', opportunityRouter);

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createPlaceValidator, createPlace);

router
  .route('/:id')
  .delete(isAuth, allowedTo('HOST'), deletePlaceValidator, deletePlace);

module.exports = router;
