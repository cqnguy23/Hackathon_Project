const jwt = require("jsonwebtoken");
const { AppError, catchAsync } = require("../helpers/utils.helper");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = require("../models/User");

const authMiddleware = {};

authMiddleware.loginRequired = catchAsync(async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString)
      return next(new AppError(401, "Login required", "Validation Error"));
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new AppError(401, "Token expired", "Validation Error"));
        } else {
          return next(
            new AppError(401, "Token is invalid", "Validation Error")
          );
        }
      }
      req.userId = payload._id;
    });

    next();
  } catch (error) {
    next(error);
  }
});

authMiddleware.adminRequired = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.role === "admin") {
      return next(new AppError(401, "Admin required", "Validation Error"));
    }
    req.adminId = user._id;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = authMiddleware;
