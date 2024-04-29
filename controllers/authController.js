const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const ApiError = require('../utils/apiError');
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

exports.login = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Invalid credentials', 401));
  }

  const token = createToken(user.id);
  res.status(200).json({ token });
});
