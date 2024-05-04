const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createOpportunityValidator = [
  check('placeId')
    .isInt()
    .withMessage('placeId must be an integer'),
  check('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  check('description')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Description must be between 1 and 255 characters'),
  check('availability')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Availability must be between 1 and 255 characters'),
  check('offers')
    .optional()
    .isArray()
    .withMessage('Offers must be an array of ids'),
  check('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array of ids'),
  validatorMiddleware
];

exports.deleteOpportunityValidator = [
  check('id')
    .isInt()
    .withMessage('id must be an integer'),
  validatorMiddleware
];
