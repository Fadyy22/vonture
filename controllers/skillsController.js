const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createSkill = asyncHandler(async (req, res) => {
  const skill = await prisma.skill.create({
    data: req.body,
  });

  res.status(201).json(skill);
});

exports.getSkills = asyncHandler(async (req, res) => {
  const skills = await prisma.skill.findMany();
  res.status(200).json(skills);
});

exports.deleteSkill = asyncHandler(async (req, res) => {
  await prisma.skill.delete({
    where: { id: req.params.id * 1 },
  });

  res.status(204).json({});
});
