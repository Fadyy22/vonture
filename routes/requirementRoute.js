const express = require('express');

const router = express.Router();

const {
  createRequirement,
  getRequirements,
  deleteRequirement,
} = require('../controllers/requirementController');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

router.
  route('/')
  .post(isAuth, allowedTo('ADMIN'), createRequirement)
  .get(getRequirements);

router
  .route('/:id')
  .delete(isAuth, allowedTo('ADMIN'), deleteRequirement);

module.exports = router;
