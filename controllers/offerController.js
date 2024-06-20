const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createOffer = asyncHandler(async (req, res) => {
  const offer = await prisma.offer.create({
    data: req.body,
  });

  res.status(201).json(offer);
});

exports.getOffers = asyncHandler(async (req, res) => {
  const offers = await prisma.offer.findMany();
  res.status(200).json(offers);
});

exports.deleteOffer = asyncHandler(async (req, res) => {
  await prisma.offer.delete({
    where: { id: req.params.id * 1 },
  });

  res.status(204).json({});
});
