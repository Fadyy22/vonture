const express = require('express');

const {
  createOpportunity,
  getAllOpportunities,
  getOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');

const {
  createOpportunityValidator,
  deleteOpportunityValidator,
} = require('../utils/validators/opportunityValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const applicationRouter = require('./applicationRoute');

const router = express.Router({ mergeParams: true });

router.use('/:id/apply', applicationRouter); // POST /opportunities/:id/apply
router.use('/:id/applications', applicationRouter); // GET /opportunities/:id/applications
router.use('/:id/application', applicationRouter); // DELETE /opportunities/:id/application

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createOpportunityValidator, createOpportunity)
  .get(getAllOpportunities);

router
  .route('/:id')
  .get(getOpportunity)
  .delete(isAuth, allowedTo('HOST'), deleteOpportunityValidator, deleteOpportunity);

module.exports = router;
