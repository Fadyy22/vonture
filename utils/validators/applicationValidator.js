const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createApplicationValidator = [
  check('id')
    .isInt()
    .withMessage('opportunityId must be an integer'),
  validatorMiddleware
];
