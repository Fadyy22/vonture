const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createOpportunityReview = asyncHandler(async (req, res, next) => {
  const review = await prisma.tourist_Opportunity_Review.create({
    data: {
      opportunityId: req.params.id * 1,
      touristId: req.user.id,
      ...req.body
    }
  });

  res.status(201).json({ review });
});

exports.deleteOpportunityReview = asyncHandler(async (req, res, next) => {
  await prisma.tourist_Opportunity_Review.delete({
    where: {
      touristId_opportunityId: {
        opportunityId: req.params.id * 1,
        touristId: req.user.id
      }
    }
  });

  res.status(204).json();
});
