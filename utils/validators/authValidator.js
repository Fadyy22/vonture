const { check, checkExact } = require('express-validator');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const {
  customValidatorMiddleware,
  globalValidatorMiddleware,
} = require('../../middlewares/validatorMiddleware');

const prisma = new PrismaClient();

exports.signupValidator = [
  check('first_name')
    .trim()
    .notEmpty()
    .withMessage('Please enter your first name')
    .isString()
    .withMessage('Please enter your first name with only characters'),
  check('last_name')
    .trim()
    .notEmpty()
    .withMessage('Please enter your last name')
    .isString()
    .withMessage('Please enter your last name with only characters'),
  check('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .bail()
    .custom(async (email, { req }) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        req.customError = {
          statusCode: 409,
          message: 'Email already exists',
        };
      }
    }),
  customValidatorMiddleware,
  check('password')
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must have a minimum length of 8 characters, with at least one lowercase letter, one uppercase letter, one number, and one special character'
    )
    .customSanitizer((password) => bcrypt.hashSync(password, 12)),
  check('phone_number')
    .trim()
    .isMobilePhone()
    .withMessage('Please enter a valid mobile number'),
  check('nationality')
    .trim()
    .notEmpty()
    .withMessage('Please enter your nationality')
    .isString()
    .withMessage('Nationality must be only characters'),
  check('bio')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Bio must be between 1 and 255 characters'),
  check('gender')
    .trim()
    .notEmpty()
    .withMessage('Please enter your gender')
    .toUpperCase()
    .isIn(['MALE', 'FEMALE'])
    .withMessage('Gender must be either MALE or FEMALE'),
  check('birthdate')
    .trim()
    .notEmpty()
    .withMessage('Please enter your birth date')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Please enter your birth date in YYYY-MM-DD format')
    .customSanitizer((birthdate) => new Date(birthdate).toISOString()),
  check('role')
    .trim()
    .notEmpty()
    .withMessage('Please enter your role')
    .toUpperCase()
    .isIn(['HOST', 'TOURIST'])
    .withMessage('Role must be either HOST or TOURIST'),
  check('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of ids'),
  checkExact([], { message: 'Unknown fileds' }),
  globalValidatorMiddleware,
];

exports.loginValidator = [
  check('email').trim().notEmpty().withMessage('Please enter your email'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Please enter your password')
    .bail()
    .custom(async (password, { req }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
          NOT: {
            role: 'ADMIN',
          },
        },
        include: {
          toursitApplications: {
            select: {
              opportunityId: true,
            },
          },
        },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        req.customError = {
          statusCode: 401,
          message: 'Invalid email or password',
        };
      }
      if (user.role === 'TOURIST') {
        user.toursitApplications = user.toursitApplications.map(
          (application) => application.opportunityId
        );
      } else {
        delete user.toursitApplications;
      }
      req.user = user;
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware,
];

exports.adminLoginValidator = [
  check('email').trim().notEmpty().withMessage('Please enter your email'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Please enter your password')
    .bail()
    .custom(async (password, { req }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
          role: 'ADMIN',
        },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        req.customError = {
          statusCode: 401,
          message: 'Invalid email or password',
        };
      }

      req.user = user;
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware,
];
