const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getRequirements = asyncHandler(async (req, res) => {
  const requirements = await prisma.requirement.findMany();
  res.status(200).json(requirements);
});
