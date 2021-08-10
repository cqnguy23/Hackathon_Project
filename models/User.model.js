const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    firstName: String,
    lastName: String,
    petitions: [{ type: Schema.ObjectId, ref: "Petition" }],
    participants: [{ type: Schema.ObjectId, ref: "Participant" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
