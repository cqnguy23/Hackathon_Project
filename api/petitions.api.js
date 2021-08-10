const express = require("express");
const router = express.Router();

const petitionsController = require("../controllers/petitions.controller");

router.post("/", petitionsController.create);
router.get("/", petitionsController.read);
router.get("/:id", petitionsController.getSinglePetition);
router.put("/:id", petitionsController.update);
router.delete("/:id", petitionsController.destroy);
router.get("/:id/items", petitionsController.getItems);

module.exports = router;
