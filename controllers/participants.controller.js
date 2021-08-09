const Participant = require("../models/Participant.model");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");

const participantsController = {};

// CREATE a foo
// - Allows a client to create a new foo.
// - Should only allow admissable parameters for a new instance of a foo.
participantsController.create = catchAsync(async (req, res) => {});

// READ a foo
// - Allows a client to retrieve a list of foos.
// - Should handle query params such as page, limit, sorting, search, etc.
// - Often produces related data. The comments of a post for a example.
participantsController.read = catchAsync(async (req, res, next) => {});

// UPDATE FOO
// - Allows a client to update a previous instance of a foo.
// - Should only allow admissable parameters to be updated by the client.
participantsController.update = catchAsync(async (req, res) => {});

// DESTROY FOO
// - Allows a client to destroy an instance of a foo.
// - Should authenticate/authorize that the client can destroy the foo.
participantsController.destroy = catchAsync(async (req, res) => {});

module.exports = participantsController;
