const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createSearchObj = (req, res, next) => {
  const search = req.query.search;
  req.searchObj = search ? {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { place: { name: { contains: search, mode: 'insensitive' } } },
      { place: { city: { contains: search, mode: 'insensitive' } } },
      { place: { country: { contains: search, mode: 'insensitive' } } },
    ]
  } : {};
  next();
};

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

exports.getAllOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: 'OPEN',
      ...req.searchObj,
    },
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

  opportunities.forEach(opportunity => {
    opportunity.from = opportunity.from.toISOString().split('T')[0];
    opportunity.to = opportunity.to.toISOString().split('T')[0];
  });

  res.status(200).json({ opportunities });
});

exports.getOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: req.params.id * 1 },
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
          pin: true,
          city: true,
          country: true,
          phone_number: true,
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

  opportunity.from = opportunity.from.toISOString().split('T')[0];
  opportunity.to = opportunity.to.toISOString().split('T')[0];

  res.status(200).json({ opportunity });
});

exports.deleteOpportunity = asyncHandler(async (req, res) => {
  await prisma.opportunity.delete({
    where: { id: req.params.id * 1 }
  });

  res.status(204).json();
});
