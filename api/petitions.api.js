const express = require("express");
const router = express.Router();

const petitionsController = require("../controllers/petitions.controller");
const { loginRequired } = require("../middlewares/auth.middleware");

router.post("/fund", loginRequired, petitionsController.createWithFund);

router.get("/", petitionsController.read);
router.get("/provider", petitionsController.getProviders);
router.get("/receiver", petitionsController.getReceivers);
router.put("/:id", petitionsController.update);
router.delete("/:id", petitionsController.destroy);
router.get("/:id", petitionsController.getItems);
router.post("/new", petitionsController.createPetitionWithItems);
router.get("/matching/:phone", petitionsController.getMatching);

module.exports = router;
