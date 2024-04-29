const express = require('express');

const {
  singup,
} = require('../controllers/authController');

const {
  signupValidator,
} = require('../utils/validators/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, singup);

module.exports = router;
