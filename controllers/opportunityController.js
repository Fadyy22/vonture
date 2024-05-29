const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createOpportunity = asyncHandler(async (req, res) => {
  req.body.hostId = req.user.id;
  req.body.placeId = req.params.id * 1;
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

exports.getAllOpportunities = asyncHandler(async (_req, res) => {
  const opportunities = await prisma.opportunity.findMany({
    where: { status: 'OPEN' },
    select: {
      id: true,
      title: true,
      description: true,
      from: true,
      to: true,
      createdAt: true,
      place: {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
          rating: true,
        }
      },
      host: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          rating: true,
        }
      }
    }
  });

  res.status(200).json({ opportunities });
});

exports.deleteOpportunity = asyncHandler(async (req, res) => {
  await prisma.opportunity.delete({
    where: { id: req.params.id * 1 }
  });

  res.status(204).json();
});
