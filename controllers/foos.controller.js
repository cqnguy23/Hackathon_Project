const Foo = require("../models/Foo.model");
const User = require("../models/User.model");
const Petition = require("../models/Petition.model");
const Participant = require("../models/Participant.model");
// const Items = require("../models/Items.model");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");

const foosController = {};

foosController.create = catchAsync(async (req, res) => {});
foosController.read = catchAsync(async (req, res, next) => {});
foosController.update = catchAsync(async (req, res) => {});
foosController.destroy = catchAsync(async (req, res) => {});

const users = [
  { fName: "Loi", lName: "Tran" },
  { fName: "Tam", lName: "Nguyen" },
  { fName: "Tan", lName: "Nguyen" },
  { fName: "Trinh", lName: "Dao" },
  { fName: "Trang", lName: "Tran" },
  { fName: "Thuy", lName: "Le" },
  { fName: "Chuong", lName: "Lee" },
  { fName: "Charles", lName: "Lee" },
  { fName: "Tan", lName: "Bui" },
  { fName: "Tuan", lName: "Hoang" },
  { fName: "Ben", lName: "Dao" },
  { fName: "Peter", lName: "Nguyen" },
];

const requestTypes = ["receive", "provide", "deliver", "borrow", "receive"];

const bounds = {
  n: [10.893521174902164, 106.67816465354217],
  e: [10.792754862735382, 106.79024066647305],
  s: [10.703829032149068, 106.6814819139672],
  w: [10.793220373965548, 106.60020903355434],
};

function randomnum(min, max) {
  return Math.random() * (max - min) + min;
}

foosController.seed = catchAsync(async (req, res) => {
  for (const u of users) {
    let owner = await User.create({ firstName: u.fName, lastName: u.lName });
    await owner.save();

    let pTimes = 50;
    for (let pIdx = 0; pIdx < pTimes; pIdx++) {
      let endLoc = null
      let startLoc = null;
      const type = requestTypes[Math.floor(Math.random() * requestTypes.length)];

      if (type === "receive") {
        endLoc = {
          lat: randomnum(bounds.n[0], bounds.s[0]),
          lng: randomnum(bounds.w[1], bounds.e[1]),
        };
      } else if (type === "provide") {
        startLoc = {
          lat: randomnum(bounds.n[0], bounds.s[0]),
          lng: randomnum(bounds.w[1], bounds.e[1]),
        };
      }
      const p = await Petition.create({
        owner,
        type,
        endLoc,
        startLoc,
        status: "requested",
      });
      await p.save();
    }
  }

  res.send({ foo: "bar" });
});

module.exports = foosController;
