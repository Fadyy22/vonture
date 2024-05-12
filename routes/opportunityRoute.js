const express = require('express');

const {
  createOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');

const {
  createOpportunityValidator,
  deleteOpportunityValidator,
} = require('../utils/validators/opportunityValidator');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const applicationRouter = require('./applicationRoute');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

router.use('/:id/apply', applicationRouter); // POST /opportunities/:id/apply
router.use('/:id/applications', applicationRouter); // GET /opportunities/:id/applications
router.use('/:id/application', applicationRouter); // DELETE /opportunities/:id/application
router.use('/:id/review', reviewRouter);

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createOpportunityValidator, createOpportunity);

router
  .route('/:id')
  .delete(isAuth, allowedTo('HOST'), deleteOpportunityValidator, deleteOpportunity);

module.exports = router;
