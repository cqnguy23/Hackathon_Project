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
    },
    type: {
      type: String,
      enum: {
        values: ["receive", "provide", "deliver", "borrow"],
      },
    },
    owner: {
      ref: "User",
      type: Schema.ObjectId,
    },
    items: [{ type: String, quantity: Number, kg: Number }],
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
  },
  {
    timestamps: true,
  }
);

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
