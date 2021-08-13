const utilsHelper = require("../helpers/utils.helper");
const Requests = require("../models/Petition.model");
const requestController = {};

requestController.getAllRequests = async (req, res, next) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalRequests = await Requests.countDocuments();
    const totalPages = Math.ceil(totalRequests / limit);
    const offset = limit * (page - 1);

    const requests = await Requests.find()
      .populate("owner")
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: "desc" });

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { requests, totalPages },
      null,
      "Get all requests successfully."
    );
  } catch (error) {
    next(error);
  }
};

requestController.getSingleRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    let request = await Requests.findById(id).populate("receiver");
    if (!request) return next(new Error("401 - Request does not exist."));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { request },
      null,
      "Get single request successfully."
    );
  } catch (error) {
    next(error);
  }
};

requestController.createRequest = async (req, res, next) => {
  try {
    let { loanAmount, startLoc: { city }, bankInfo, description, images } = req.body;

    let request = await Requests.create({
      loanAmount,
      city: startLoc.city,
      bankInfo,
      description,
      images,
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { request },
      null,
      "Created new donation request successfully."
    );
  } catch (error) {
    next(error);
  }
};

requestController.updateRequest = async (req, res, next) => {
  try {
    let { id } = req.body;
    let { received } = req.body;
    let requestById = await Requests.findById({ _id: id });
    console.log(id, received);
    const remaining =
      requestById.amount_remaining - received / requestById.need;
    const isWaiting = remaining <= 0 ? false : true;
    console.log(remaining, isWaiting);

    let request = await Requests.findByIdAndUpdate(id, {
      amount_remaining: remaining,
      isWaiting: isWaiting,
    });
    console.log(request);
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { request },
      null,
      "Updated successfully."
    );
  } catch (error) {
    next(error);
  }
};

requestController.deleteRequest = async (req, res, next) => {
  try {
    let requestId = req.params.id;
    await Requests.findByIdAndDelete(requestId);
    utilsHelper.sendResponse(
      res,
      200,
      true,
      null,
      null,
      "Deleted successfully."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = requestController;
