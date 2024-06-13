const deleteImages = require('../utils/deleteImages');
const { validationResult } = require('express-validator');


exports.globalValidatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    deleteImages(req);
    return res.status(400).json({ error: errors.array(), message: 'Validation Failed.' });
  }
  next();
};

exports.customValidatorMiddleware = (req, res, next) => {
  if (req.customError) {
    deleteImages(req);
    return res.status(req.customError.statusCode).json({ message: req.customError.message });
  }
  next();
};
