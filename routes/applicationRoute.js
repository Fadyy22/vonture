const express = require('express');

const {
  createApplication,
  deleteApplication,
} = require('../controllers/applicationController');

const {
  createApplicationValidator,
  deleteApplicationValidator,
} = require('../utils/validators/applicationValidator');


const allowedTo = require('../middlewares/allowedToMiddleware');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(isAuth, allowedTo('TOURIST'), createApplicationValidator, createApplication)
  .delete(isAuth, allowedTo('TOURIST'), deleteApplicationValidator, deleteApplication);

module.exports = router;
