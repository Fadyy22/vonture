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

exports.getAllPlaces = asyncHandler(async (req, res) => {
  const places = await prisma.place.findMany({
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
      rating: true,
      host: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          rating: true
        }
      }
    }
  });

  res.status(200).json({ places });
});

exports.deletePlace = asyncHandler(async (req, res) => {
  const id = req.params.id * 1;

  await prisma.place.delete({
    where: { id }
  });

  res.status(204).json();
});
