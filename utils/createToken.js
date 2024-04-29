const JWT = require('jsonwebtoken');

const createToken = (payload) => {
  return JWT.sign({ userId: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });
};

module.exports = createToken;
