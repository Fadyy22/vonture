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

const applicationRoute = require('./applicationRoute');

const router = express.Router();

router.use('/:id/apply', applicationRoute);

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createOpportunityValidator, createOpportunity);

router
  .route('/:id')
  .delete(isAuth, allowedTo('HOST'), deleteOpportunityValidator, deleteOpportunity);

module.exports = router;
