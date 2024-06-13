const { check, checkExact } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const {
  customValidatorMiddleware,
  globalValidatorMiddleware,
} = require('../../middlewares/validatorMiddleware');

const prisma = new PrismaClient();

exports.createOpportunityValidator = [
  check('id')
    .isInt()
    .withMessage('placeId must be an integer')
    .bail()
    .custom(async (placeId, { req }) => {
      const place = await prisma.place.findUnique({
        where: { id: placeId * 1 }
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
  check('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  check('description')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Description must be at least 50 characters long'),
  check('from')
    .trim()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Must be a date in YYYY-MM-DD format')
    .bail()
    .customSanitizer(from => new Date(from).toISOString()),
  check('to')
    .trim()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Must be a date in YYYY-MM-DD format')
    .bail()
    .custom((to, { req }) => {
      if (new Date(to) < new Date(req.body.from)) {
        throw new Error('To date must be after from date');
      }
      return true;
    })
    .customSanitizer(to => new Date(to).toISOString()),
  check('offers')
    .optional()
    .isArray()
    .withMessage('Offers must be an array of ids'),
  check('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array of ids'),
  checkExact([], { message: 'Unknown fileds' }),
  globalValidatorMiddleware
];

exports.deleteOpportunityValidator = [
  check('id')
    .isInt()
    .withMessage('id must be an integer')
    .bail()
    .custom(async (id, { req }) => {
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: id * 1 }
      });

      if (!opportunity) {
        return req.customError = {
          statusCode: 404,
          message: 'Opportunity not found'
        };
      }
      if (opportunity.hostId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];
