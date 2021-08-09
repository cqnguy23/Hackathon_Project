const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petitionSchema = Schema(
  {
    userId: Number,
    participants: { type: Schema.ObjectId, ref: "Participant" },
    loanAmount: Number,
    status: ["pending", "inProgress", "completed"],
    actionType: ["receive", "provide", "deliver", "borrow"],
    startCoords: {
      lat: Number,
      long: Number,
      address: String,
      city: String,
      country: String,
    },
    endCoords: {
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
