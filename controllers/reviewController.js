const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createPlaceReview = asyncHandler(async (req, res) => {
  req.placeId = req.params.id * 1;
  req.touristId = req.user.id;
  const review = await prisma.tourist_Place_Review.create({
    data: req.body
  });

  const reviewsAvg = await prisma.tourist_Place_Review.aggregate({
    where: {
      placeId: req.params.id * 1,
    },
    _avg: {
      rating: true,
    },
  });

  await prisma.place.update({
    where: { id: req.params.id * 1 },
    data: {
      rating: {
        set: reviewsAvg._avg.rating,
      },
    },
  });


  res.status(201).json({ review });
});

exports.createUserReview = asyncHandler(async (req, res) => {
  req.body.givenById = req.user.id;
  req.body.receivedById = req.params.id * 1;

  const review = await prisma.host_Tourist_Review.create({
    data: req.body
  });

  const reviewsAvg = await prisma.host_Tourist_Review.aggregate({
    where: {
      receivedById: req.body.receivedById,
    },
    _avg: {
      rating: true,
    },
  });
  console.log(reviewsAvg);

  await prisma.user.update({
    where: { id: req.body.receivedById },
    data: {
      rating: {
        set: reviewsAvg._avg.rating,
      },
    },
  });

  res.status(201).json({ review });
});

exports.deletePlaceReview = asyncHandler(async (req, res) => {
  await prisma.tourist_Place_Review.delete({
    where: {
      touristId_placeId: {
        placeId: req.params.id * 1,
        touristId: req.user.id
      }
    }
  });

  res.status(204).json();
});

exports.deleteUserReview = asyncHandler(async (req, res) => {
  await prisma.host_Tourist_Review.delete({
    where: {
      receivedById_givenById: {
        receivedById: req.params.id * 1,
        givenById: req.user.id
      }
    }
  });

  res.status(204).json();
});
