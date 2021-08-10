const Petition = require("../models/Petition.model");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const utilsHelper = require("../helpers/utils.helper");

const petitionsController = {};

// CREATE a petition
// - Allows a client to create a new petition.
// - Should only allow admissable parameters for a new instance of a petition.
petitionsController.create = catchAsync(async (req, res, next) => {
  let { userId, type, loanAmount } = req.body;
  let petition;
  if (!type || !userId) {
    return next(new AppError(400, "Required fields are missing!"));
  }
  if (type == "borrow" || type == "provide") {
    if (!loanAmount) {
      return next(new AppError(400, "Required loan amount!"));
    }
  }
  if (type == "borrow" || type == "provide") {
    petition = await Petition.create({
      userId,
      loanAmount,
      type,
      status: "pending",
    });
  } else {
    petition = await Petition.create({
      userId,
      type,
      status: "pending",
    });
  }

  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { petition },
    null,
    "Petition created sucessfully"
  );
});

// READ a petition
// - Allows a client to retrieve a list of petitions from the use.
// - Often produces related data. The comments of a post for a example.
petitionsController.read = catchAsync(async (req, res) => {
  const petitions = await Petition.find({}).populate("owner");
  res.send(petitions)
});

// UPDATE FOO
// - Allows a client to update a previous instance of a petition.
// - Should only allow admissable parameters to be updated by the client.
petitionsController.update = catchAsync(async (req, res) => {
  let petitionId = req.params.id;
  console.log(petitionId);
  let { loanAmount } = req.body;
  if (loanAmount) {
    let petition = await Petition.findByIdAndUpdate(
      petitionId,
      { loanAmount },
      { new: true }
    );
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { petition },
      null,
      "Petition updated sucessfully"
    );
  } else {
    return next(new AppError(401, "Required loan amount!"));
  }
});

// DESTROY FOO
// - Allows a client to destroy an instance of a petition.
// - Should authenticate/authorize that the client can destroy the foo.
petitionsController.destroy = catchAsync(async (req, res) => {
  let petitionId = req.params.id;
  let petition = await Petition.findById(petitionId);
  if (petition) {
    petition = await Petition.findByIdAndDelete(petitionId);
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { petition },
      null,
      "Petition deleted sucessfully"
    );
  } else {
    return next(new AppError(400, "Petition cannot be found"));
  }
});

module.exports = petitionsController;
