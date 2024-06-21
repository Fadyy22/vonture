const { check } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const {
  customValidatorMiddleware,
  globalValidatorMiddleware,
} = require('../../middlewares/validatorMiddleware');

const prisma = new PrismaClient();

exports.paymentValidator = [
  check('id')
    .isInt()
    .withMessage('opportunityId must be a number')
    .bail()
    .custom(async (opportunityId, { req }) => {
      const application = await prisma.tourist_Application.findFirst({
        where: {
          touristId: req.user.id,
          opportunityId: opportunityId * 1,
          status: 'PENDING'
        }
      });
      if (!application) {
        req.customError = {
          statusCode: 404,
          message: 'Accepted application for this opportunity was not found'
        };
      }
    }),
  customValidatorMiddleware,
  globalValidatorMiddleware
];
