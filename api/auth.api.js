const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @Path : localhost:3000/api/auth
 * @Method : POST
 * @Access : public
 * @Description : Create an auth
 */

router.post("/", authController.login);

module.exports = router;
