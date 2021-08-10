const express = require("express");
const router = express.Router();

const foosController = require("../controllers/foos.controller");

router.post("/", foosController.create);
router.get("/", foosController.read);
router.put("/:id", foosController.update);
router.delete("/:id", foosController.destroy);
router.get("/seed", foosController.seed);
// localhost:3000/api/foos/seed
module.exports = router;
