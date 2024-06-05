const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const createToken = require('../utils/createToken');

const prisma = new PrismaClient();

exports.singup = asyncHandler(async (req, res) => {
  const user = await prisma.user.create({
    data: req.body
  });
  const token = createToken(user.id);
  res.status(201).json({ user, token });
});

exports.login = asyncHandler(async (req, res) => {
  const token = createToken(req.user.id);
  res.status(200).json({ user: req.user, token });
});
