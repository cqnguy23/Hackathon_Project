const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = Schema({
  userId: Number,
  actionType: ["receiver", "provider", "driver", "loaner", "borrower"],
  endCoords: {
    lat: Number,
    long: Number,
    address: String,
    city: String,
    country: String,
  },
});

const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
