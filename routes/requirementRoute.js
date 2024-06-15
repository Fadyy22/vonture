const express = require('express');

const router = express.Router();

const {
  getRequirements,
} = require('../controllers/requirementController');

router.
  route('/')
  .get(getRequirements);

module.exports = router;
