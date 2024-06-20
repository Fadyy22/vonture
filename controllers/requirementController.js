const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createRequirement = asyncHandler(async (req, res) => {
  const requirement = await prisma.requirement.create({
    data: req.body,
  });

  res.status(201).json(requirement);
});

exports.getRequirements = asyncHandler(async (req, res) => {
  const requirements = await prisma.requirement.findMany();
  res.status(200).json(requirements);
});

exports.deleteRequirement = asyncHandler(async (req, res) => {
  await prisma.requirement.delete({
    where: { id: req.params.id * 1 },
  });

  res.status(204).json({});
});
