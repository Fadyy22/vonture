const asyncHandler = require("express-async-handler");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
  });

  res.status(200).json({ users });
});

exports.getMyProfile = async (req, res) => {
  res.status(200).json({ user: req.user });
};
