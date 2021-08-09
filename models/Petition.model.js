const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petitionSchema = Schema(
  {
    loanAmount: Number,
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
    participants: [{ type: Schema.ObjectId, ref: "Participant" }],
  },
  {
    timestamps: true,
  }
);

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
