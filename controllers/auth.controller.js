const {
  catchAsync,
  AppError,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const authController = {};

authController.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ phone });
  if (!user)
    return next(new AppError(300, "User is not existed", "Login Error"));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError(400, "Wrong password", "Login Error"));

  const accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});

module.exports = authController;
