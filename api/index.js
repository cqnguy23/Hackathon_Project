const express = require('express');
const router = express.Router();

const foosRouter = require("./foos.api");
router.use("/foos", foosRouter);

const usersRouter = require("./users.api");
router.use("/users", usersRouter);

const petitionsRouter = require("./petitions.api");
router.use("/petitions", petitionsRouter);

const participants = require("./participants.api");
router.use("/participants", participants);

module.exports = router;
