const Petition = require("../models/Petition.model");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const utilsHelper = require("../helpers/utils.helper");
const User = require("../models/User.model");
const Item = require("../models/Item.model");

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
  let owner = await User.findById(userId);
  if (!owner) {
    return next(new AppError(400, "Unable to locate owner"));
  }
  if (type == "borrow" || type == "provide") {
    if (!loanAmount) {
      return next(new AppError(400, "Required loan amount!"));
    }
    petition = await Petition.create({
      owner,
      loanAmount,
      type,
      status: "pending",
    });
  } else {
    petition = await Petition.create({
      owner,
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

petitionsController.createPetitionWithItems = catchAsync(async (req, res) => {
  let { userId, itemArray, petitionType } = req.body;
  if (!petitionType || !userId) {
    return next(new AppError(400, "Required fields are missing!"));
  }
  let items;
  let owner = await User.findById(userId)
    .populate("petitions")
    .populate("owner");
  if (!owner) {
    return next(new AppError(400, "Unable to locate owner"));
  }
  if (owner.petitions.length != 0) {
    let petition = owner.petitions.find(
      (petition) => petition.status == "pending"
    );
    console.log(owner.petitions);
    items = await Promise.all(
      itemArray.map(async (item) => {
        let tempItem = await Item.create({
          petition,
          name: item.name,
          quantity: item.quantity,
          type: item.type,
        });
        await tempItem.save();
        return await tempItem;
      })
    );

    //add to items if petition already exists
    let newPetition = await Petition.findByIdAndUpdate(
      petition,
      { $push: { items: items } },
      { new: true }
    )
      .populate("items")
      .populate("owner");
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { newPetition },
      null,
      "Petition updated sucessfully"
    );
    //create new petition and add items
  } else {
    let petition = await Petition.create({
      type: petitionType,
      owner,
      status: "pending",
    });
    petition.save();
    items = await Promise.all(
      itemArray.map(async (item) => {
        let tempItem = await Item.create({
          petition,
          name: item.name,
          quantity: item.quantity,
          type: item.type,
        });
        await tempItem.save();
        return await tempItem;
      })
    );
    petition = await Petition.findByIdAndUpdate(petition, items, { new: true })
      .populate("items")
      .populate("owner");
    petition.save();
    let user = await User.findByIdAndUpdate(owner, {
      $push: { petitions: petition },
    });
    user.save();
    console.log({ user });
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { petition },
      null,
      "Petition created sucessfully"
    );
  }
});
// READ a petition
// - Allows a client to retrieve a list of petitions from the use.
// - Often produces related data. The comments of a post for a example.
petitionsController.read = catchAsync(async (req, res) => {
  const petitions = await Petition.find({}).populate("owner").populate("items");
  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { petitions },
    null,
    "Get petitions sucessfully"
  );
});

// UPDATE FOO
// - Allows a client to update a previous instance of a petition.
// - Should only allow admissable parameters to be updated by the client.
petitionsController.update = catchAsync(async (req, res) => {
  let petitionId = req.params.id;
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

petitionsController.getItems = catchAsync(async (req, res, next) => {
  let petitionId = req.params.id;
  let petition = await Petition.findById(petitionId);

  if (!petition) {
    return next(new AppError(401, "Petition not found!"));
  }
  let itemsId = petition.items;
  let items = await Promise.all(
    itemsId.map(async (itemId) => {
      const item = await Item.findById(itemId);
      console.log(item);
      return item;
    })
  );
  /* await Promise.all(jobs.map( async (job) =>  {
            return { ...job, companyName: await getCompanyName(job.companyId)}
        })) */
  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { items },
    null,
    "Retrieve items sucessfully"
  );
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
