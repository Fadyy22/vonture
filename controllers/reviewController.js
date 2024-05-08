const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createOpportunityReview = asyncHandler(async (req, res, next) => {
  req.body.date = new Date();
  const review = await prisma.tourist_Opportunity_Review.create({
    data: {
      opportunityId: req.params.id * 1,
      touristId: req.user.id,
      ...req.body
    }
  });

  res.status(201).json({ review });
});
