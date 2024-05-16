const { check } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const {
  customValidatorMiddleware,
  globalValidatorMiddleware,
} = require('../../middlewares/validatorMiddleware');

const prisma = new PrismaClient();

exports.createPlaceReviewValidator = [
  check('id')
    .isInt()
    .withMessage('placeId must be an integer')
    .bail()
    .custom(async (placeId, { req }) => {
      const opportunity = await prisma.place.findUnique({
        where: { id: placeId * 1 }
      });
      if (!opportunity) {
        return req.customError = {
          statusCode: 404,
          message: 'Place not found'
        };
      }

      const existingReview = await prisma.tourist_Place_Review.findUnique({
        where: {
          touristId_placeId: {
            placeId: placeId * 1,
            touristId: req.user.id,
          },
        },
      });
      if (existingReview) {
        return req.customError = {
          statusCode: 409,
          message: 'You have already reviewed this place'
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

exports.createUserReviewValidator = [
  check('id')
    .isInt()
    .withMessage('userId must be an integer')
    .bail()
    .custom(async (userId, { req }) => {
      const user = await prisma.user.findUnique({
        where: { id: userId * 1 }
      });
      if (!user) {
        return req.customError = {
          statusCode: 404,
          message: 'User not found'
        };
      }

      const existingReview = await prisma.host_Tourist_Review.findUnique({
        where: {
          receivedById_givenById: {
            receivedById: userId * 1,
            givenById: req.user.id,
          }
        },
      });
      if (existingReview) {
        return req.customError = {
          statusCode: 409,
          message: `You have already reviewed this ${req.user.role === 'HOST' ? 'tourist' : 'host'}`
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

exports.deleteOpportunityReviewValidator = [
  check('id')
    .isInt()
    .withMessage('opportunityId must be an integer')
    .bail()
    .custom(async (opportunityId, { req }) => {
      const review = await prisma.tourist_Opportunity_Review.findUnique({
        where: {
          touristId_opportunityId: {
            opportunityId: opportunityId * 1,
            touristId: req.user.id,
          }
        }
      });
      if (!review) {
        return req.customError = {
          statusCode: 404,
          message: 'Review not found'
        };
      }
      if (review.touristId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];
