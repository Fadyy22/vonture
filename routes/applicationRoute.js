const express = require('express');

const {
  createApplication,
} = require('../controllers/applicationController');

const {
  createApplicationValidator,
} = require('../utils/validators/applicationValidator');


const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(isAuth, allowedTo('TOURIST'), createApplicationValidator, createApplication);

module.exports = router;
