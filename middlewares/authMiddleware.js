const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/apiError');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = asyncHandler(async (req, res, next) => {
  let decodedToken;

  // 1) Check if token exists, if exists get it 
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
    return next(new ApiError('Unauthenticated.', 401));

  const token = req.headers.authorization.split(' ')[1];

  // 2) Verify token (no change happend, expired token)
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return next(new ApiError('Invalid token.', 401));
  }

  // 3) Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.userId
    }
  });

  if (!user)
    next(new ApiError('The user who belongs to this token does no longer exist.', 401));

  req.user = user;
  next();
});
