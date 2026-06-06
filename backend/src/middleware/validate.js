const ApiError = require("../utils/apiError");

const validate = (schema) => (req, _res, next) => {
  const result = schema(req.body);
  if (!result.valid) {
    return next(new ApiError(400, "Validation failed", result.errors));
  }
  req.body = result.value;
  return next();
};

module.exports = { validate };
