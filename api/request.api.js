const express = require("express");
const requestController = require("../controllers/request.controller");
const router = express.Router();

/**
 * @route GET /donation_requests
 * @description Get all donation request
 * @access public
 */
router.get("/", requestController.getAllRequests);

/**
 * @route GET /donation_request/:id
 * @description Get detail of single request
 * @access public
 */
router.get("/:id", requestController.getSingleRequest);

/**
 * @route POST /donation_request
 * @description create a new request
 * @access login required
 */
router.post("/", requestController.createRequest);

/**
 * @route PUT /donation_request/:id
 * @description update/edit an existing request
 * @access login required (should be the one who created this request)
 */
router.put("/:id", requestController.updateRequest);

/**
 * @route DELETE /donation_request/:id
 * @description delete an existing request
 * @access login required and admin
 */
router.delete("/:id", requestController.deleteRequest);

module.exports = router;
