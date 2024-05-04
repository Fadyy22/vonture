const express = require('express');

const {
  createOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');

const {
  createOpportunityValidator,
  deleteOpportunityValidator,
} = require('../utils/validators/opportunityValidator');

const isAuth = require('../middlewares/authMiddleware');
const allowedTo = require('../middlewares/allowedToMiddleware');

const router = express.Router();

router
  .route('/')
  .post(isAuth, allowedTo('HOST'), createOpportunityValidator, createOpportunity);

router
  .route('/:id')
  .delete(isAuth, allowedTo('HOST'), deleteOpportunity);

module.exports = router;
