const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getOffers = asyncHandler(async (req, res) => {
  const offers = await prisma.offer.findMany();
  res.status(200).json(offers);
});
