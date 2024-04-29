const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const createToken = require('../utils/createToken');

const prisma = new PrismaClient();

exports.singup = asyncHandler(async (req, res, next) => {
  req.body.birthdate = new Date(req.body.birthdate).toISOString();
  req.body.password = await bcrypt.hash(req.body.password, 12);
  const user = await prisma.user.create({
    data: req.body
  });
  const token = createToken(user.id);
  res.status(201).json({ user, token });
});
