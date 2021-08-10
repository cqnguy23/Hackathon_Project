const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = Schema({
  owner: {
    ref: "User",
    type: Schema.ObjectId,
    required: true,
  },
  petition: {
    ref: "Petition",
    type: Schema.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum: {
      values: ["receiver", "provider", "driver", "loaner", "borrower"],
    },
  },
  endLoc: {
    lat: Number,
    lng: Number,
    address: String,
    city: String,
    country: String,
  },
});

const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
