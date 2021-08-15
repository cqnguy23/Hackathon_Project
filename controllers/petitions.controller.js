const Petition = require("../models/Petition.model");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const utilsHelper = require("../helpers/utils.helper");
const User = require("../models/User.model");
const Item = require("../models/Item.model");
const { getDistance } = require("geolib");

const petitionsController = {};
// CREATE a petition
// - Allows a client to create a new petition.
// - Should only allow admissable parameters for a new instance of a petition.
// - Create a petiton will create a Participant, update the current User.petitions and User.participant (handle by Petition.middleware)
petitionsController.createWithFund = catchAsync(async (req, res, next) => {
  let { type, fundAmount, bankInfo, description, targetId } = req.body;
  let { userId } = req;
  let petition;
  if (!type || !userId || !fundAmount) {
    return next(new AppError(400, "Required fields are missing!"));
  }
  owner = await User.findById(userId);
  if (!owner) {
    return next(new AppError(400, "Unable to locate owner"));
  }

  //fund donate
  if (type == "provide") {
    if (!targetId)
      return next(new AppError(400, "Fund donation need target petition"));
    petition = await Petition.findById(targetId);
    if (petition.status == "complete") {
      return next(new AppError(400, "Fund donation to a completed petition"));
    }
  }

  //fund request
  petition = await Petition.create({
    owner: userId,
    startedAmount: fundAmount,
    actualAmount: type == "provide" ? fundAmount : 0,
    type,
    bankInfo,
    description,
    targetId: type == "provide" ? targetId : null,
    status: type == "provide" ? "complete" : "requested",
  });

  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { petition },
    null,
    "Petition created sucessfully"
  );
});

petitionsController.createPetitionWithItems = catchAsync(
  async (req, res, next) => {
    let { userId, itemArray, petitionType, description } = req.body;
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
      let updatedPetition;

      items = await Promise.all(
        itemArray.map(async (item) => {
          let tempItem = await Item.find({
            name: item.name,
            petition: petition,
          });
          if (tempItem.length !== 0) {
            let updateItem = await Item.findByIdAndUpdate(
              tempItem,
              {
                $inc: { quantity: item.quantity },
              },
              { new: true }
            );

            return updateItem;
          } else {
            let newItem = await Item.create({
              petition,
              name: item.name,
              quantity: item.quantity,
              type: item.type,
            });
            await Petition.findByIdAndUpdate(
              petition,
              { $push: { items: newItem } },
              { new: true }
            )
              .populate("items")
              .populate("owner");
            return newItem;
          }
        })
      );
      updatedPetition = await Petition.findById(petition)
        .populate("items")
        .populate("owner");

      //add to items if petition already exists

      return utilsHelper.sendResponse(
        res,
        200,
        true,
        { updatedPetition },
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
          let newItem = await Item.create({
            petition,
            name: item.name,
            quantity: item.quantity,
            type: item.type,
          });
          await newItem.save();
          return await newItem;
        })
      );
      petition = await Petition.findByIdAndUpdate(
        petition,
        { items },
        { new: true }
      )
        .populate("items")
        .populate("owner");
      petition.save();
      let user = await User.findByIdAndUpdate(owner, {
        $push: { petitions: petition },
      });
      user.save();
      return utilsHelper.sendResponse(
        res,
        200,
        true,
        { petition },
        null,
        "Petition created sucessfully"
      );
    }
  }
);
// READ a petition
// - Allows a client to retrieve a list of petitions from the use.
// - Often produces related data. The comments of a post for a example.
petitionsController.read = catchAsync(async (req, res) => {
  const petitions = await Petition.find({}).populate("owner").populate("items");

  let newPetitions = await Promise.all(
    petitions.map(async (petition) => {
      let distance;
      if (petition.type == "provide") {
        distance = getDistance(
          {
            latitude: petition.startLoc?.lat,
            longitude: petition.startLoc?.lng,
          },
          {
            latitude: petition.owner.currentLocation.lat,
            longitude: petition.owner.currentLocation.lng,
          }
        );
      } else if (petition.type == "receive") {
        distance = getDistance(
          { latitude: petition.endLoc.lat, longitude: petition.endLoc.lng },
          {
            latitude: petition.owner.currentLocation.lat,
            longitude: petition.owner.currentLocation.lng,
          }
        );
      }
      let newPetition = await Petition.findByIdAndUpdate(
        petition,
        {
          distance,
        },
        { new: true }
      );
      newPetition.save();

      return await newPetition;
    })
  );
  newPetitions.sort((a, b) => a.distance - b.distance);
  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { newPetitions },
    null,
    "Get petitions sucessfully"
  );
});

petitionsController.getProviders = catchAsync(async (req, res, next) => {
  let { page, limit } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPetitions = await Petition.count({
    type: "provide",
  });

  const totalPages = Math.ceil(totalPetitions / limit);
  const offset = limit * (page - 1);
  const petitions = await Petition.find({
    type: "provide",
  })
    .populate("owner")
    .populate("items")
    .skip(offset)
    .limit(limit);
  let newPetitions = await Promise.all(
    petitions.map(async (petition) => {
      let distance = getDistance(
        {
          latitude: petition.startLoc.lat,
          longitude: petition.startLoc.lng,
        },
        {
          latitude: petition.owner.currentLocation.lat,
          longitude: petition.owner.currentLocation.lng,
        }
      );
      let newPetition = await Petition.findByIdAndUpdate(
        petition,
        {
          distance,
        },
        { new: true }
      )
        .populate("owner")
        .populate("items");
      newPetition.save();

      return await newPetition;
    })
  );
  newPetitions.sort((a, b) => a.distance - b.distance);
  // let page = req.query.page;
  // let limit = req.query.limit;

  // if (page && limit) {
  //   newPetitions = newPetitions.slice((page - 1) * limit, page * limit);
  // }
  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { newPetitions, totalPages },
    null,
    "Get provider petitions sucessfully"
  );
});

petitionsController.getReceivers = catchAsync(async (req, res, next) => {
  let { page, limit } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPetitions = await Petition.count({
    type: "receive",
  });

  const totalPages = Math.ceil(totalPetitions / limit);
  const offset = limit * (page - 1);
  const petitions = await Petition.find({
    type: "receive",
  })
    .populate("owner")
    .populate("items")
    .skip(offset)
    .limit(limit);

  let newPetitions = await Promise.all(
    petitions.map(async (petition) => {
      let distance = getDistance(
        {
          latitude: petition.endLoc.lat,
          longitude: petition.endLoc.lng,
        },
        {
          latitude: petition.owner.currentLocation.lat,
          longitude: petition.owner.currentLocation.lng,
        }
      );

      let newPetition = await Petition.findByIdAndUpdate(
        petition,
        {
          distance,
        },
        { new: true }
      )
        .populate("owner")
        .populate("items");

      newPetition.save();

      return await newPetition;
    })
  );
  newPetitions.sort((a, b) => a.distance - b.distance);
  // let page = req.query.page;
  // let limit = req.query.limit;

  // if (page && limit) {
  //   newPetitions = newPetitions.slice((page - 1) * limit, page * limit);
  // }

  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { newPetitions, totalPages },

    null,
    "Get receiver petitions sucessfully"
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
petitionsController.getReceiveMatchingPetitions = catchAsync(
  async (req, res, next) => {
    let petitionId = req.params.id;

    if (!petitionId) {
      return next(new AppError(400, "Required fields are missing!"));
    }
    petition = await Petition.findById(petitionId).populate("items");
    if (!petition) {
      return next(new AppError(400, "Unable to locate petition"));
    }
    let matchedPetitions = [];
    let tempPetitions = await Promise.all(
      petition.items.map(async (item) => {
        let query = await Item.find({ name: item.name }).populate("petition");
        query = query.map((item) => item.petition._id.toString());
        matchedPetitions = matchedPetitions.concat(query);
        return query;
      })
    );

    let uniq = [...new Set(matchedPetitions)];
    console.log(uniq);
    uniq = await Promise.all(
      uniq.map(async (id) => {
        return await Petition.findById(id).populate("items").populate("owner");
      })
    );
    let result = uniq.filter((petition) => petition.type == "receive");
    // result = await Promise.all(
    //   result.map(async (petition) => {
    //     let distance = getDistance(
    //       {
    //         latitude: petition.endLoc.lat,
    //         longitude: petition.endLoc.lng,
    //       },
    //       {
    //         latitude: petition.owner.currentLocation.lat,
    //         longitude: petition.owner.currentLocation.lng,
    //       }
    //     );

    //     let newPetition = await Petition.findByIdAndUpdate(
    //       petition,
    //       {
    //         distance,
    //       },
    //       { new: true }
    //     )
    //       .populate("owner")
    //       .populate("items");

    //     return newPetition;
    //   })
    // );

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { result },
      null,
      "Retrieve items sucessfully"
    );
    //fund donate
  }
);

petitionsController.getProvideMatchingPetitions = catchAsync(
  async (req, res, next) => {
    let petitionId = req.params.id;

    if (!petitionId) {
      return next(new AppError(400, "Required fields are missing!"));
    }
    petition = await Petition.findById(petitionId).populate("items");
    if (!petition) {
      return next(new AppError(400, "Unable to locate petition"));
    }
    let matchedPetitions = [];
    let tempPetitions = await Promise.all(
      petition.items.map(async (item) => {
        let query = await Item.find({ name: item.name }).populate("petition");
        query = query.map((item) => item.petition._id.toString());
        matchedPetitions = matchedPetitions.concat(query);
        return query;
      })
    );

    let uniq = [...new Set(matchedPetitions)];
    console.log(uniq);
    uniq = await Promise.all(
      uniq.map(async (id) => {
        return await Petition.findById(id).populate("items").populate("owner");
      })
    );
    let result = uniq.filter((petition) => petition.type == "provide");
    // result = await Promise.all(
    //   result.map(async (petition) => {
    //     let distance = getDistance(
    //       {
    //         latitude: petition.startLoc.lat,
    //         longitude: petition.startLoc.lng,
    //       },
    //       {
    //         latitude: petition.owner.currentLocation.lat,
    //         longitude: petition.owner.currentLocation.lng,
    //       }
    //     );

    //     let newPetition = await Petition.findByIdAndUpdate(
    //       petition,
    //       {
    //         distance,
    //       },
    //       { new: true }
    //     )
    //       .populate("owner")
    //       .populate("items");

    //     return newPetition;
    //   })
    // );
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { result },
      null,
      "Retrieve items sucessfully"
    );
    //fund donate
  }
);
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
