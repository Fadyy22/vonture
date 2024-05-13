const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createPlace = asyncHandler(async (req, res) => {
  req.body.hostId = req.user.id;
  const place = await prisma.place.create({
    data: req.body
  });

  res.status(201).json({ place });
});

exports.deletePlace = asyncHandler(async (req, res) => {
  const id = req.params.id * 1;

  await prisma.place.delete({
    where: { id }
  });

  res.status(204).json();
});
