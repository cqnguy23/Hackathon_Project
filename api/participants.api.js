const express = require("express");
const router = express.Router();

const participants = require("../controllers/participants.controller");
//when i create participants, they need to belong to a petition
router.post("/", participants.create);
router.get("/", participants.read);
router.put("/:id", participants.update);
router.delete("/:id", participants.destroy);

module.exports = router;
