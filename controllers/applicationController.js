const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const ApiError = require('../utils/apiError');

const prisma = new PrismaClient();

exports.createApplication = asyncHandler(async (req, res, next) => {
  const id = req.params.id * 1;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id }
  });

  if (!opportunity) {
    return next(new ApiError('Opportunity not found', 404));
  }

  const application = await prisma.tourist_Application.create({
    data: {
      opportunityId: id,
      touristId: req.user.id
    }
  });

  res.status(201).json({ application });
});
