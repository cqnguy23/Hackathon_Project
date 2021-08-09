const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    petitions: { type: Schema.ObjectId, ref: "Petition" },
    participants: { type: Schema.ObjectId, ref: "Participant" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
