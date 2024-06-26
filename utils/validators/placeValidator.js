const { check, checkExact } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const {
  customValidatorMiddleware,
  globalValidatorMiddleware,
} = require('../../middlewares/validatorMiddleware');

const prisma = new PrismaClient();

exports.createPlaceValidator = [
  check('name')
    .trim()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),
  check('pin')
    .trim()
    .isString()
    .withMessage('Pin must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Pin must be between 3 and 255 characters'),
  check('city')
    .trim()
    .isString()
    .withMessage('City must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('City must be between 3 and 255 characters'),
  check('country')
    .trim()
    .isString()
    .withMessage('Country must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Country must be between 3 and 255 characters'),
  check('phone_number')
    .trim()
    .isMobilePhone()
    .withMessage('Phone number must be a valid phone number'),
  check('type')
    .trim()
    .isString()
    .withMessage('Type must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Type must be between 3 and 255 characters'),
  checkExact([], { message: 'Unknown fileds' }),
  globalValidatorMiddleware
];

exports.deletePlaceValidator = [
  check('id')
    .isNumeric()
    .withMessage('Id must be a number')
    .bail()
    .custom(async (id, { req }) => {
      const place = await prisma.place.findUnique({
        where: { id: id * 1 }
      });

      if (!place) {
        return req.customError = {
          statusCode: 404,
          message: 'Place not found'
        };
      }
      if (req.user.role === 'HOST' && place.hostId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];
