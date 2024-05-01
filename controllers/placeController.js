const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');

const prisma = new PrismaClient();

exports.createPlace = asyncHandler(async (req, res, next) => {
  const place = await prisma.place.create({
    data: req.body
  });

  res.status(201).json({ place });
});
