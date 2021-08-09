const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petitionSchema = Schema(
  {
    owner: {
      ref: "User",
      type: Schema.ObjectId,
    },
    participants: { type: Schema.ObjectId, ref: "Participant" },
    loanAmount: Number,
    status: {
      type: String,
      enum: {
        values: ["pending", "inProgress", "complete"],
      },
    },
    type: {
      type: String,
      enum: {
        values: ["receive", "provide", "deliver", "borrow"],
      },
    },
    startLoc: {
      lat: Number,
      long: Number,
      address: String,
      city: String,
      country: String,
    },
    endLoc: {
      lat: Number,
      long: Number,
      address: String,
      city: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
