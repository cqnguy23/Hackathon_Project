const express = require("express");
const router = express.Router();

const itemsController = require("../controllers/items.controller");

router.post("/", itemsController.create);
router.get("/", itemsController.read);
router.put("/:id", itemsController.update);
router.delete("/:id", itemsController.destroy);
// localhost:3000/api/items/seed
module.exports = router;
