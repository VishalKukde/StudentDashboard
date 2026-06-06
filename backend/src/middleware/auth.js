const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/jwt");
const { findOne } = require("../store");

const protect = async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Authentication token is required"));
  }

  try {
    const decoded = verifyToken(token);
    const user = await findOne("users", (item) => String(item._id) === String(decoded.id));

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to access this resource"));
  }
  return next();
};

module.exports = { protect, authorizeRoles };