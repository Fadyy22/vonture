const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createOpportunity = asyncHandler(async (req, res, next) => {
  req.body.hostId = req.user.id;
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
  await prisma.opportunity.delete({
    where: { id: req.params.id * 1 }
  });

  res.status(204).json();
});
