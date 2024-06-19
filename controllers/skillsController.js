const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getSkills = asyncHandler(async (req, res) => {
  const skills = await prisma.skill.findMany();
  res.status(200).json(skills);
});
