const { check } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const customValidatorMiddleware = require('../../middlewares/customValidatorMiddleware');
const globalValidatorMiddleware = require('../../middlewares/globalValidatorMiddleware');

const prisma = new PrismaClient();

exports.createPlaceValidator = [
  check('name')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),
  check('pin')
    .isString()
    .withMessage('Pin must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Pin must be between 3 and 255 characters'),
  check('city')
    .isString()
    .withMessage('City must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('City must be between 3 and 255 characters'),
  check('country')
    .isString()
    .withMessage('Country must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Country must be between 3 and 255 characters'),
  check('phone_number')
    .isMobilePhone()
    .withMessage('Phone number must be a valid phone number'),
  check('type')
    .isString()
    .withMessage('Type must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Type must be between 3 and 255 characters'),
  globalValidatorMiddleware
];

exports.deletePlaceValidator = [
  check('id')
    .isNumeric()
    .withMessage('Id must be a number')
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
      if (place.hostId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];
