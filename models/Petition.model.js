const mongoose = require("mongoose");
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
    receiveAmount: {
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
    items: [{ type: Schema.ObjectId, ref: "Item" }],
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

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
