const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petitionSchema = Schema(
  {
    loanAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["requested", "pending", "complete"],
      },
      default: "requested",
    },
    type: {
      type: String,
      enum: {
        values: ["receive", "provide", "deliver", "borrow"],
      },
      default: "receive",
    },
    owner: {
      ref: "User",
      type: Schema.ObjectId,
    },
    items: [{ ref: "Item", type: Schema.ObjectId }],
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
    participants: [{ type: Schema.ObjectId, ref: "Participant" }],
    items: [{ type: Schema.ObjectId, ref: "Item" }],
    bankInfo: {
      bankName: String,
      branchName: String,
      bankNumber: Number,
      ownerName: String,
    },
    description: String,
    images: [{ imageUrl: String }],
  },
  {
    timestamps: true,
  },
);

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
