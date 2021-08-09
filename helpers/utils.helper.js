"use strict";
const crypto = require("crypto");
const utilsHelper = {};

// Manage how we respond to clients here when needed
utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;
  return res.status(status).json(response);
};

utilsHelper.catchAsync = (func) => (req, res, next) =>
  func(req, res, next).catch((err) => next(err));

class AppError extends Error {
  constructor(statusCode, message, errorType) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    // all errors using this class are operational errors.
    this.isOperational = true;
    // create a stack trace for debugging (Error obj, void obj to avoid stack pollution)
    Error.captureStackTrace(this, this.constructor);
  }
}

utilsHelper.generateRandomHexString = (len) => {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, len)
    .toUpperCase(); // return required number of characters
};

utilsHelper.filterFields = (obj, allows) => {
  const result = {};
  for (const field of allows) {
    result[field] = field in obj ? obj[field] : "";
  }
  return result;
};

utilsHelper.AppError = AppError;
module.exports = utilsHelper;
