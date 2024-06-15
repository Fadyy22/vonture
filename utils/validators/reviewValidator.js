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
      const place = await prisma.place.findUnique({
        where: { id: placeId * 1 },
        include: {
          opportunities: {
            select: { id: true }
          }
        }
      });
      if (!place) {
        return req.customError = {
          statusCode: 404,
          message: 'Place not found'
        };
      }

      const hasApplied = await prisma.tourist_Application.findFirst({
        where: {
          opportunityId: {
            in: place.opportunities.map(opportunity => opportunity.id)
          },
          touristId: req.user.id,
          status: 'ACCEPTED',
        },
      }
      );

      if (!hasApplied) {
        return req.customError = {
          statusCode: 403,
          message: 'You must apply and be accepted for an opportunity before reviewing a place'
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
    .trim()
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

      let whereClause;
      let message;
      if (user.role === 'HOST') {
        whereClause = {
          opportunity: {
            hostId: userId * 1
          },
          touristId: req.user.id,
          status: 'ACCEPTED'
        };
        message = 'You must apply and be accepted for an opportunity before reviewing a host';
      } else {
        whereClause = {
          opportunity: {
            hostId: req.user.id * 1
          },
          touristId: userId * 1,
          status: 'ACCEPTED'
        };
        message = 'You must accept an application before reviewing a tourist';
      }

      const hasApplied = await prisma.tourist_Application.findFirst({
        where: whereClause,
      });

      if (!hasApplied) {
        return req.customError = {
          statusCode: 403,
          message: message
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
    .trim()
    .isString()
    .withMessage('comment must be a string')
    .isLength({ min: 1, max: 255 })
    .withMessage('comment must be between 1 and 255 characters'),
  globalValidatorMiddleware
];

exports.deletePlaceReviewValidator = [
  check('id')
    .isInt()
    .withMessage('placeId must be an integer'),
  check('touristId')
    .isInt()
    .bail()
    .custom(async (touristId, { req }) => {
      const review = await prisma.tourist_Place_Review.findUnique({
        where: {
          touristId_placeId: {
            placeId: req.params.id * 1,
            touristId: touristId * 1,
          }
        }
      });
      if (!review) {
        return req.customError = {
          statusCode: 404,
          message: 'Review not found'
        };
      }
      if (req.user.role === 'TOURIST' && review.touristId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];

exports.deleteUserReviewValidator = [
  check('id')
    .isInt()
    .withMessage('userId must be an integer'),
  check('givenById')
    .custom(async (givenById, { req }) => {
      const review = await prisma.host_Tourist_Review.findUnique({
        where: {
          receivedById_givenById: {
            receivedById: req.params.id * 1,
            givenById: givenById * 1,
          }
        }
      });
      if (!review) {
        return req.customError = {
          statusCode: 404,
          message: 'Review not found'
        };
      }
      if (req.user.role !== 'ADMIN' && review.givenById !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];
