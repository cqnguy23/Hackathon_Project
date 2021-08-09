const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petitionSchema = Schema(
  {
  },
  {
    timestamps: true,
  },
);

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
