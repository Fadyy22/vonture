const express = require('express');

const { singup, login } = require('../controllers/authController');

const {
  signupValidator,
  loginValidator,
  adminLoginValidator,
} = require('../utils/validators/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, singup);
router.post('/login', loginValidator, login);
router.post('login/dashboard', adminLoginValidator, login);

module.exports = router;
