const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createPlaceReview = asyncHandler(async (req, res) => {
  const review = await prisma.tourist_Place_Review.create({
    data: {
      placeId: req.params.id * 1,
      touristId: req.user.id,
      ...req.body
    }
  });

  res.status(201).json({ review });
});

exports.createUserReview = asyncHandler(async (req, res) => {
  req.body.givenById = req.user.id;
  req.body.receivedById = req.params.id * 1;

  const review = await prisma.host_Tourist_Review.create({
    data: req.body
  });

  res.status(201).json({ review });
});

exports.deleteOpportunityReview = asyncHandler(async (req, res) => {
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
