const { validationResult } = require('express-validator');

const globalValidatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array(), message: 'Validation Failed.' });
  }
  next();
};

module.exports = globalValidatorMiddleware;
