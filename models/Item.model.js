const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = Schema(
  {
    petition: {
      ref: "Petition",
      type: Schema.ObjectId,
    },
    quantity: Number,
    weight: Number,
    type: {
      type: String,
      enum: {
        values: ["clothing", "food", "health", 'misc'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
