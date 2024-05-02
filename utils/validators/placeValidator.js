const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

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
  validatorMiddleware
];

exports.deletePlaceValidator = [
  check('id')
    .isNumeric()
    .withMessage('Id must be a number'),
  validatorMiddleware
];
