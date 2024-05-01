const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');

const prisma = new PrismaClient();

exports.createOpportunity = asyncHandler(async (req, res, next) => {
  req.body.hostId = req.user.id;
  const opportunity = await prisma.opportunity.create({
    data: req.body
  });

  res.status(201).json({ opportunity });
});
