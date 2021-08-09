const express = require('express');
const router = express.Router();

const foosRouter = require("./foos.api");
router.use("/foos", foosRouter);

module.exports = router;
