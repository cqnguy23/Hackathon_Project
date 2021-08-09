const express = require("express");
const router = express.Router();

const foosController = require("../controllers/foos.controller");

router.post("/", foosController.create);
router.get("/", foosController.list);
router.put("/:id", foosController.update);
router.delete("/:id", foosController.destroy);

module.exports = router;
