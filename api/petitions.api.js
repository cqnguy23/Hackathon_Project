const express = require("express");
const router = express.Router();

const petitionsController = require("../controllers/petitions.controller");

router.post("/", petitionsController.createWithFund);
router.get("/", petitionsController.read);
router.get("/provider", petitionsController.getProviders);
router.get("/receiver", petitionsController.getReceivers);
router.put("/:id", petitionsController.update);
router.delete("/:id", petitionsController.destroy);
router.get("/:id", petitionsController.getItems);
router.post("/new", petitionsController.createPetitionWithItems);

module.exports = router;
