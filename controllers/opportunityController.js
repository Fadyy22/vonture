const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const ApiError = require('../utils/apiError');

const prisma = new PrismaClient();

exports.createOpportunity = asyncHandler(async (req, res, next) => {
  req.body.hostId = req.user.id;
  const place = await prisma.place.findUnique({
    where: { id: req.body.placeId }
  });

  if (!place) {
    return next(new ApiError('Place not found', 404));
  }

  if (place.hostId !== req.user.id) {
    return next(new ApiError('Unauthorized', 403));
  }
  req.body.requirements = {
    connect: req.body.requirements.map(id => ({ id }))
  };
  req.body.offers = {
    connect: req.body.offers.map(id => ({ id }))
  };
  const opportunity = await prisma.opportunity.create({
    data: req.body
  });

  res.status(201).json({ opportunity });
});

exports.deleteOpportunity = asyncHandler(async (req, res, next) => {
  const id = req.params.id * 1;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id }
  });

  if (!opportunity) {
    return next(new ApiError('Opportunity not found', 404));
  }
  if (opportunity.hostId !== req.user.id) {
    return next(new ApiError('Unauthorized', 403));
  }

  await prisma.opportunity.delete({
    where: { id }
  });

  res.status(204).json();
});
