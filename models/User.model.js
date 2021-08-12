const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    firstName: String,
    lastName: String,
    petitions: [{ type: Schema.ObjectId, ref: "Petition" }],
    participants: [{ type: Schema.ObjectId, ref: "Participant" }],
    gender: {
      type: String,
      enum: {
        values: ["f", "m"],
      },
    },
    age: {
      type: Number,
      default: 18,
    },
    isolatedDate: { type: Date, default: Date.now },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
