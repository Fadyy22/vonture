const { check } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const customValidatorMiddleware = require('../../middlewares/customValidatorMiddleware');
const globalValidatorMiddleware = require('../../middlewares/globalValidatorMiddleware');

const prisma = new PrismaClient();

exports.createOpportunityReviewValidator = [
  check('id')
    .isInt()
    .withMessage('opportunityId must be an integer')
    .bail()
    .custom(async (opportunityId, { req }) => {
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: opportunityId * 1 }
      });
      if (!opportunity) {
        return req.customError = {
          statusCode: 404,
          message: 'Opportunity not found'
        };
      }

      const existingReview = await prisma.tourist_Opportunity_Review.findUnique({
        where: {
          touristId_opportunityId: {
            touristId: req.user.id,
            opportunityId: opportunityId * 1,
          }
        }
      });
      if (existingReview) {
        return req.customError = {
          statusCode: 409,
          message: 'You have already reviewed this opportunity'
        };
      }
    }),
  customValidatorMiddleware,
  check('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('rating must be a number between 1 and 5'),
  check('comment')
    .isString()
    .withMessage('comment must be a string')
    .isLength({ min: 1, max: 255 })
    .withMessage('comment must be between 1 and 255 characters'),
  globalValidatorMiddleware
];
