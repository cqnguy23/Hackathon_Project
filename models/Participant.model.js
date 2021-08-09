const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = Schema(
  {
  },
  {
    timestamps: true,
  },
);

const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
