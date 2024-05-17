const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const {
  customValidatorMiddleware,
  globalValidatorMiddleware,
} = require('../../middlewares/validatorMiddleware');

const prisma = new PrismaClient();

exports.signupValidator = [
  check('first_name')
    .notEmpty()
    .withMessage('Please enter your first name')
    .isString()
    .withMessage('Please enter your first name with only characters'),
  check('last_name')
    .notEmpty()
    .withMessage('Please enter your last name')
    .isString()
    .withMessage('Please enter your last name with only characters'),
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .bail()
    .custom(async (email, { req }) => {
      const user = await prisma.user.findFirst({
        where: { email }
      });
      if (user) {
        req.customError = {
          statusCode: 409,
          message: 'Email already exists'
        };
      }
    }),
  customValidatorMiddleware,
  check('password')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage('Password must have a minimum length of 8 characters, with at least one lowercase letter, one uppercase letter, one number, and one special character'),
  check('phone_number')
    .isMobilePhone()
    .withMessage('Please enter a valid mobile number'),
  check('nationality')
    .notEmpty()
    .withMessage('Please enter your nationality')
    .isString()
    .withMessage('Nationality must be only characters'),
  check('bio')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Bio must be between 1 and 255 characters'),
  check('gender')
    .notEmpty()
    .withMessage('Please enter your gender')
    .isIn(['MALE', 'FEMALE'])
    .withMessage('Gender must be either MALE or FEMALE'),
  check('birthdate')
    .notEmpty()
    .withMessage('Please enter your birth date.')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Please enter your birth date in YYYY-MM-DD format.'),
  check('role')
    .notEmpty()
    .withMessage('Please enter your role')
    .isIn(['HOST', 'TOURIST', 'ADMIN'])
    .withMessage('Role must be either HOST, TOURIST, or ADMIN'),
  globalValidatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Please enter your email'),
  check('password')
    .notEmpty()
    .withMessage('Please enter your password')
    .bail()
    .custom(async (password, { req }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email
        }
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        req.customError = {
          statusCode: 401,
          message: 'Invalid email or password'
        };
      }
      req.user = user;
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];
