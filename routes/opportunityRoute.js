const express = require('express');

const {
  createOpportunity,
  getAllOpportunities,
  getOpportunity,
  closeOpportunity,
  createSearchObj,
  createPlaceFilter,
} = require('../controllers/opportunityController');

const {
  createOpportunityValidator,
  closeOpportunityValidator,
} = require('../utils/validators/opportunityValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const applicationRouter = require('./applicationRoute');

const router = express.Router({ mergeParams: true });

router.use('/:id/apply', applicationRouter); // POST /opportunities/:id/apply
router.use('/:id/applications', applicationRouter.rootApplicationsRouter.getOpportunityApplications); // GET /opportunities/:id/applications
router.use('/:id/application', applicationRouter); // DELETE /opportunities/:id/application

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createOpportunityValidator, createOpportunity)
  .get(createSearchObj, createPlaceFilter, getAllOpportunities);

router
  .route('/:id')
  .get(getOpportunity)
  .put(isAuth, allowedTo('HOST'), closeOpportunityValidator, closeOpportunity);

module.exports = router;
