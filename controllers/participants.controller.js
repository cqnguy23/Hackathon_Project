const Participant = require("../models/Participant.model");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Petition = require("../models/Petition.model");
const User = require("../models/User.model");

const participantsController = {};

// CREATE a participant
// - Allows a client to create a new participant.
// - Should only allow admissable parameters for a new instance of a participant.
participantsController.create = catchAsync(async (req, res, next) => {
  let { userId, petitionId, type, endLoc } = req.body;
  if (!type || !endLoc || !userId || !petitionId) {
    return next(new AppError(400, "Required fields are missing!"));
  }

  let owner = await User.findById(userId);
  let petition = await Petition.findById(petitionId);
  if (!owner || !petition) {
    return next(new AppError(400, "Unable to locate owner or petition"));
  }
  let participant = await Participant.create({
    owner,
    petition,
    type,
    endLoc,
  });

  return sendResponse(
    res,
    200,
    true,
    { participant },
    null,
    "Participant created sucessfully"
  );
});

// READ a participant
// - Allows a client to retrieve a list of participants.
// - Should handle query params such as page, limit, sorting, search, etc.
// - Often produces related data. The comments of a post for a example.
participantsController.read = catchAsync(async (req, res, next) => {
  let participants = await Participant.find();
  return sendResponse(
    res,
    200,
    true,
    { participants },
    null,
    "Get participants sucessfully"
  );
});

// UPDATE participant
// - Allows a client to update a previous instance of a participant.
// - Should only allow admissable parameters to be updated by the client.
participantsController.update = catchAsync(async (req, res) => {
  let participantId = req.params.id;
  let { endLoc } = req.body;
  let participant = await Participant.findByIdAndUpdate(participantId, {
    endLoc,
  });
  return sendResponse(
    res,
    200,
    true,
    { participant },
    null,
    "Participant updated sucessfully"
  );
});

// DESTROY participant
// - Allows a client to destroy an instance of a participant.
// - Should authenticate/authorize that the client can destroy the participant.
participantsController.destroy = catchAsync(async (req, res) => {
  let participantId = req.params.id;
  let participant = await Participant.findById(participantId);
  if (participant) {
    participant = await Participant.findByIdAndDelete(participantId);
    return sendResponse(
      res,
      200,
      true,
      { participant },
      null,
      "Participant deleted sucessfully"
    );
  } else {
    return next(new AppError(400, "Participant cannot be found"));
  }
});

module.exports = participantsController;
