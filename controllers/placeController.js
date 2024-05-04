const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');

const prisma = new PrismaClient();

exports.createPlace = asyncHandler(async (req, res, next) => {
  req.body.hostId = req.user.id;
  const place = await prisma.place.create({
    data: req.body
  });

  res.status(201).json({ place });
});

exports.deletePlace = asyncHandler(async (req, res, next) => {
  const id = req.params.id * 1;
  const place = await prisma.place.findUnique({
    where: { id }
  });

  if (!place) {
    return next(new ApiError('Place not found', 404));
  }
  if (place.hostId !== req.user.id) {
    return next(new ApiError('Unauthorized', 403));
  }

  await prisma.place.delete({
    where: { id }
  });

  res.status(204).json();
});
