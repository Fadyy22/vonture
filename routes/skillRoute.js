const express = require('express');

const { getSkills } = require('../controllers/skillsController');

const router = express.Router();

router
  .route('/')
  .get(getSkills);

module.exports = router;
