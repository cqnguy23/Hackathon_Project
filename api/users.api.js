const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");

router.post("/", usersController.create);
router.get("/", usersController.read);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.destroy);

module.exports = router;
