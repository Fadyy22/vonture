const customValidatorMiddleware = (req, res, next) => {
  if (req.customError) {
    return res.status(req.customError.statusCode).json({ message: req.customError.message });
  }
  next();
};

module.exports = customValidatorMiddleware;
