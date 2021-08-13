const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");

const usersController = {};

// CREATE a foo
// - Allows a client to create a new foo.
// - Should only allow admissable parameters for a new instance of a foo.
usersController.create = catchAsync(async (req, res) => {
  let { firstName, lastName, phone, password, ...content } = req.body;
  
  let user = await User.findOne({ phone });
  if (user) return next(new Error("401 - User already exits"));
  const salt = await bcrypt.genSalt(10);

  if (!password) {
    password = "name" + Math.floor(Math.random() * 10);
  }
  password = await bcrypt.hash(password, salt);

  user = await User.create({
    firstName, 
    lastName,
    phone,
    password,
    ...content
  });

  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User Successfully"
  );
});

// READ a foo
// - Allows a client to retrieve a list of foos.
// - Should handle query params such as page, limit, sorting, search, etc.
// - Often produces related data. The comments of a post for a example.
usersController.read = catchAsync(async (req, res, next) => {});

// UPDATE FOO
// - Allows a client to update a previous instance of a foo.
// - Should only allow admissable parameters to be updated by the client.
usersController.update = catchAsync(async (req, res) => {});

// DESTROY FOO
// - Allows a client to destroy an instance of a foo.
// - Should authenticate/authorize that the client can destroy the foo.
usersController.destroy = catchAsync(async (req, res) => {});

module.exports = usersController;
