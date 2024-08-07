const express = require('express');

const {
  createPlace,
  getAllPlaces,
  getPlace,
  deletePlace,
  parsePlaceImages,
  createUserFilter,
  approvePlace,
} = require('../controllers/placeController');

const {
  createPlaceValidator,
  deletePlaceValidator,
} = require('../utils/validators/placeValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const opportunityRouter = require('./opportunityRoute');
const reviewRouter = require('./reviewRoute');

const router = express.Router({ mergeParams: true });

router.use('/:id/opportunities', opportunityRouter);
router.post('/:id/reviews', reviewRouter.rootReviewRouter.createPlaceReview);
router.delete('/:id/reviews', reviewRouter.rootReviewRouter.deletePlaceReview);

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), parsePlaceImages, createPlaceValidator, createPlace)
  .get(createUserFilter, getAllPlaces);

router
  .route('/:id')
  .get(getPlace)
  .delete(isAuth, allowedTo('HOST', 'ADMIN'), deletePlaceValidator, deletePlace);

router.patch('/:id/approve', isAuth, allowedTo('ADMIN'), approvePlace);

module.exports = router;
