const express = require('express');

const {
  singup, login,
} = require('../controllers/authController');

const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, singup);
router.post('/login', loginValidator, login);

module.exports = router;
