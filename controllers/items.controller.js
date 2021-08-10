const itemsController = {};
const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Item = require("../models/Item.model");
const Petition = require("../models/Petition.model");
itemsController.create = catchAsync(async (req, res, next) => {
  let { quantity, weight, type, petition } = req.body;

  if (!type || (!quantity && !weight)) {
    return next(new AppError(400, "Required fields are missing!"));
  }

  let item = await Item.create({
    petition,
    quantity,
    type,
    weight,
  });
  await item.save();
  let newPetition = await Petition.findByIdAndUpdate(
    petition,
    { $push: { items: item._id } },
    { new: true }
  );

  return sendResponse(
    res,
    200,
    true,
    { newPetition },
    null,
    "Item created sucessfully"
  );
});
itemsController.read = catchAsync(async (req, res, next) => {
  const items = await Item.find({}).populate("owner");
  return sendResponse(res, 200, true, { items }, null, "Get items sucessfully");
});
itemsController.update = catchAsync(async (req, res, next) => {});
itemsController.destroy = catchAsync(async (req, res, next) => {});

module.exports = itemsController;
