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
      default: "receive",
    },
    owner: {
      ref: "User",
      type: Schema.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

petitionSchema.statics.createParticipant = async function (petition, next) {
  //receive petition that created, create participanting
  const participant = await Participant.create({
    owner: petition.owner,
    type: "receiver",
    petition: petition._id,
  });
  //update User info of the owner of this petition
  let user = await User.findByIdAndUpdate(
    petition.owner,
    {
      $push: { petitions: petition._id, participants: participant._id },
    },
    { new: true }
  );
  console.log(user);
  //return partitcipant just create
  return participant;
};

petitionSchema.pre("save", async function (next) {
  //pre save, send this petition to the createPartitipant
  const participant = await this.constructor.createParticipant(this);
  //update this petition.participants after createPariticant
  this.participants = [...this.participants, participant._id];

  next();
});

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
