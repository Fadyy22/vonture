const { check } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const {
  customValidatorMiddleware,
  globalValidatorMiddleware,
} = require('../../middlewares/validatorMiddleware');

const prisma = new PrismaClient();

exports.createApplicationValidator = [
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

      const appliedBefore = await prisma.tourist_Application.findUnique({
        where: {
          touristId_opportunityId: {
            opportunityId: opportunityId * 1,
            touristId: req.user.id
          }
        }
      });
      if (appliedBefore) {
        return req.customError = {
          statusCode: 409,
          message: 'You have already applied for this opportunity'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];

exports.getOpportunityApplicationsValidator = [
  check('id')
    .isInt()
    .withMessage('id must be an integer')
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

      if (req.user.role === 'HOST' && opportunity.hostId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];

exports.deleteApplicationValidator = [
  check('id')
    .isInt()
    .withMessage('id must be an integer')
    .bail()
    .custom(async (opportunityId, { req }) => {
      const application = await prisma.tourist_Application.findUnique({
        where: {
          touristId_opportunityId: {
            opportunityId: opportunityId * 1,
            touristId: req.user.id
          }
        }
      });

      if (!application) {
        return req.customError = {
          statusCode: 404,
          message: 'Application not found'
        };
      }
      if (application.touristId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];

exports.acceptApplicationValidator = [
  check('opportunityId')
    .isInt()
    .withMessage('opportunityId must be an integer'),
  check('touristId')
    .isInt()
    .withMessage('touristId must be an integer')
    .bail()
    .custom(async (touristId, { req }) => {
      const application = await prisma.tourist_Application.findUnique({
        where: {
          touristId_opportunityId: {
            opportunityId: req.body.opportunityId,
            touristId,
          },
        },
        include: {
          opportunity: {
            select: {
              hostId: true
            },
          },
        },
      });
      if (!application) {
        return req.customError = {
          statusCode: 404,
          message: 'Application not found'
        };
      }

      if (application.opportunity.hostId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];

exports.rejectApplicationValidator = [
  check('opportunityId')
    .isInt()
    .withMessage('opportunityId must be an integer'),
  check('touristId')
    .isInt()
    .withMessage('touristId must be an integer')
    .bail()
    .custom(async (touristId, { req }) => {
      const application = await prisma.tourist_Application.findUnique({
        where: {
          touristId_opportunityId: {
            opportunityId: req.body.opportunityId,
            touristId,
          },
        },
        include: {
          opportunity: {
            select: {
              hostId: true
            },
          },
        },
      });
      if (!application) {
        return req.customError = {
          statusCode: 404,
          message: 'Application not found'
        };
      }

      if (application.opportunity.hostId !== req.user.id) {
        return req.customError = {
          statusCode: 403,
          message: 'Unauthorized'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];
