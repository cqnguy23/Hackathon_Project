const mongoose = require("mongoose");

const Participant = require("./Participant.model");
const User = require("./User.model");
const Schema = mongoose.Schema;

const petitionSchema = Schema(
  {
    status: {
      type: String,
      enum: {
        values: ["requested", "pending", "delivering", "received", "complete"],
      },
      default: "requested",
    },
    startedAmount: {
      default: 0,
      type: Number,
    },
    actualAmount: {
      default: 0,
      type: Number,
    },
    type: {
      type: String,
      enum: {
        values: ["receive", "provide", "deliver"],
      },
      required: true,
      default: "receive",
    },
    owner: {
      ref: "User",
      type: Schema.ObjectId,
      required: true,
    },
    startLoc: {
      lat: Number,
      lng: Number,
      address: String,
      city: String,
      country: String,
    },
    endLoc: {
      lat: Number,
      lng: Number,
      address: String,
      city: String,
      country: String,
    },
    description: String,
    images: [{ imageUrl: String }],
    items: [{ ref: "Item", type: Schema.ObjectId }],
    participants: [{ type: Schema.ObjectId, ref: "Participant" }],
    bankInfo: {
      bankName: String,
      ownerName: String,
      branchName: String,
      bankNumber: Number,
    },
    targetId: { type: Schema.ObjectId, ref: "Petition" },
  },
  {
    timestamps: true,
  }
);

petitionSchema.statics.calculateActual = async function (targetId) {
  const adjustment = await this.aggregate([
    { $match: { targetId } },
    {
      $group: {
        _id: "$targetId",
        actualAmount: {
          $sum: { $cond: [{ $eq: ["$type", "provide"] }, "$actualAmount", 0] },
        },
      },
    },
  ]);

  let pet = await Petition.findByIdAndUpdate(
    targetId,
    [
      { $set: { actualAmount: adjustment[0].actualAmount } },
      {
        $set: {
          status: {
            $cond: [
              { $lte: ["$startedAmount", adjustment[0].actualAmount] },
              "complete",
              "request",
            ],
          },
        },
      },
    ],

    {
      new: true,
    }
  );
};

petitionSchema.statics.createParticipant = async function (petition) {
  let type = petition.type;
  if (type == "receive") {
    type = "receiver";
  } else if (type == "provide") {
    type = "provider";
  }

  const participant = await Participant.create({
    owner: petition.owner,
    type,
    petition: petition._id,
  });

  let user = await User.findByIdAndUpdate(
    petition.owner,
    {
      $push: { petitions: petition._id, participants: participant._id },
    },
    { new: true }
  );

  return participant;
};

petitionSchema.pre("save", async function (next) {
  const participant = await this.constructor.createParticipant(this);
  //this is calling the petition in creating
  this.participants = [...this.participants, participant._id];
  //this is calling the targeted petition
  if (this.targetId) {
    await Petition.findByIdAndUpdate(this.targetId, {
      $push: { participants: participant._id },
    });
  }
  next();
});

petitionSchema.post("save", async function () {
  await this.constructor.calculateActual(this.targetId);
});

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
