import ApiError from "../utils/apiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  console.error("Error path:", _req.originalUrl);
  console.error("Error details:", err);

  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || "Internal server error"
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
