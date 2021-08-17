const Foo = require("../models/Foo.model");
const User = require("../models/User.model");
const Petition = require("../models/Petition.model");
const Participant = require("../models/Participant.model");
// const Items = require("../models/Items.model");
const Blog = require("../models/Blog.model");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Item = require("../models/Item.model");
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
  { fName: "Harry", lName: "Potter" },
  { fName: "Albus", lName: "Dumbledore" },
  { fName: "Salazar", lName: "Slytherin" },
  { fName: "Godric", lName: "Gryffindor" },
  { fName: "Gellert", lName: "Grindelwald" },
];

const requestTypes = ["receive", "provide", "deliver"];
const genders = ["m", "f"];

const bounds = {
  n: [10.893521174902164, 106.67816465354217],
  e: [10.792754862735382, 106.79024066647305],
  s: [10.703829032149068, 106.6814819139672],
  w: [10.793220373965548, 106.60020903355434],
};

function randomnum(min, max) {
  return Math.random() * (max - min) + min;
}

const random = (n) => Math.floor(Math.random() * n);

const itemTypes = ["food", "clothing", "health", "misc"];
const itemNames = {
  clothing: ["Shoes", "Hat", "Shirt"],
  food: ["Instance Noodles", "Rice", "Fruit & Veggies", "Various Vegetables"],
  health: ["Face masks", "Gloves", "COVID Body Suit"],
  misc: ["Company", "Companionship", "Friendship", "Someone to talk to"],
};

const isolatedDate = function () {
  const now = new Date();
  const thirtyDaysAgo = now.setDate(now.getDate() - random(16));
  const thirtyDaysAgoDate = new Date(thirtyDaysAgo);
  return thirtyDaysAgoDate;
};

const foos = [
  "foo",
  "bar",
  "spam",
  "ham",
  "bam",
  "can",
  "land",
  "alpha",
  "bravo",
  "charlie",
  "delta",
  "echo",
  "foxtrot",
  "golf",
  "hotel",
  "igloo",
  "juliet",
  "kilo",
  "lima",
  "mike",
  "november",
  "oscar",
  "papa",
  "quebec",
  "romeo",
  "sierra",
  "tango",
  "uniform",
  "victor",
  "whiskey",
  "xray",
  "yankee",
  "zulu",
];

foosController.blogs = catchAsync(async (req, res) => {
  for (const foo of foos) {
    const blog = Blog.create({ title: foo, body: foo, author: foo, slug: foo });
  }
});

foosController.seed = catchAsync(async (req, res) => {
  for (const u of users) {
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const sex = gender === "m" ? "men" : "women";
    const id = random(75);
    let phone = "0984";
    for (let i = 0; i < 7; i++) {
      phone += `${Math.floor(Math.random() * 10)}`;
    }
    let owner = await User.create({
      gender,
      currentLocation: {
        lat: randomnum(bounds.n[0], bounds.s[0]),
        lng: randomnum(bounds.w[1], bounds.e[1]),
      },
      lastName: u.lName,
      firstName: u.fName,
      phone,
      isolatedDate: isolatedDate(),
      tbImgUrl: `https://randomuser.me/api/portraits/thumb/${sex}/${id}.jpg`,
      mdImgURl: `https://randomuser.me/api/portraits/med/${sex}/${id}.jpg`,
      lgImgUrl: `https://randomuser.me/api/portraits/${sex}/${id}.jpg`,
    });
    await owner.save();

    let pTimes = 10;
    for (let pIdx = 0; pIdx < pTimes; pIdx++) {
      let endLoc = null;
      let startLoc = null;
      const type =
        requestTypes[Math.floor(Math.random() * requestTypes.length)];

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
      p.createdAt = isolatedDate();
      await p.save();
      //create some items if appropriate

      if (type === "receive") {
        let itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        let item = await Item.create({
          weight: 3,
          petition: p,
          type: itemType,
        });
        itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        item = await Item.create({
          name: itemNames[itemType][
            Math.floor(Math.random() * itemNames[itemType].length)
          ],
          weight: 5,
          petition: p,
          type: itemType,
        });
        await item.save();
        p.items.push(item);
        await p.save();
      } else if (type === "provide") {
        let itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        let item = await Item.create({
          name: itemNames[itemType][
            Math.floor(Math.random() * itemNames[itemType].length)
          ],
          weight: 3,
          petition: p,
          type: itemType,
        });
        await p.save();
      }
    }
  }
  res.send({ foo: "Seeded" });
});

foosController.delete = catchAsync(async (req, res) => {
  await User.remove({}, function () {
    console.log("Deleteing Users");
  });
  await Item.remove({}, function () {
    console.log("Deleteing Items");
  });
  await Participant.remove({}, function () {
    console.log("Deleteing Participant");
  });
  await Petition.remove({}, function () {
    console.log("Deleteing Petition");
  });
  await Blog.remove({}, function () {
    console.log("Deleteing Blogs");
  });

  res.send({ foo: "Deleted" });
});

module.exports = foosController;
