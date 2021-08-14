const mongoose = require("mongoose");
const { AppError } = require("../helpers/utils.helper");
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
    targetId: { type: Schema.ObjectId, ref: "Petit" },
  },
  {
    timestamps: true,
  }
);
petitionSchema.statics.changeStatus = async function (petition) {
  console.log("got here");
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
  console.log("target id", this.targetId);
  const participant = await this.constructor.createParticipant(this);
  this.participants = [...this.participants, participant._id];

  next();
});
petitionSchema.pre("findOneAndUpdate", async function (next) {
  this.doc = await this.findOne();
  if (this.doc.status == "completed")
    return next(new AppError(400, "Petition was completed", "Petition Error"));
  this.doc.status = "completed";
  await this.doc.updateOne({ status: "completed" }, { new: true });
  console.log(this.doc.status);
  next();
});

petitionSchema.post("findOneAndUpdate", async function () {
  await this.doc.constructor.createParticipant(this.doc);
});

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
