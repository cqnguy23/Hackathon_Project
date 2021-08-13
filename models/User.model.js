const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
//remove this later and add to env
const JWT_SECRET_KEY = "jaguar";

const userSchema = Schema(
  {
    firstName: String,
    lastName: String,
    phone: Number,
    password: String,
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
  }
);

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
