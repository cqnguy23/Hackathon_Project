const express = require("express");
const router = express.Router();

const foosController = require("../controllers/foos.controller");

router.post("/", foosController.create);
router.get("/", foosController.read);
router.put("/:id", foosController.update);
router.delete("/:id", foosController.destroy);
router.get("/seed", foosController.seed);
router.get("/delete", foosController.delete);

module.exports = router;
