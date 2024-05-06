const { check } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const prisma = new PrismaClient();

exports.createApplicationValidator = [
  check('id')
    .isInt()
    .withMessage('opportunityId must be an integer')
    .custom(async (opportunityId, { req }) => {
      const appliedBefore = await prisma.tourist_Application.findUnique({
        where: {
          touristId_opportunityId: {
            opportunityId: opportunityId * 1,
            touristId: req.user.id
          }
        }
      });

      if (appliedBefore) {
        throw new Error('You have already applied to this opportunity');
      }
    }),
  validatorMiddleware
];

exports.deleteApplicationValidator = [
  check('id')
    .isInt()
    .withMessage('id must be an integer'),
  validatorMiddleware
];
