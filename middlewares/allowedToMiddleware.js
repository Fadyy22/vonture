const ApiError = require('../utils/apiError');

const allowedTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('Unauthorized.', 403));
    }
    next();
  };

module.exports = allowedTo;
