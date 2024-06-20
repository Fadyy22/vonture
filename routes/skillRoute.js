const express = require('express');

const {
  createSkill,
  getSkills,
  deleteSkill
} = require('../controllers/skillsController');

const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(isAuth, allowedTo('ADMIN'), createSkill)
  .get(getSkills);

router
  .route('/:id')
  .delete(isAuth, allowedTo('ADMIN'), deleteSkill);

module.exports = router;
