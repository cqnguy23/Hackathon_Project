const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fooSchema = Schema(
  {
    foo: String,
    bar: { type: String, unique: false, default: "Foo" },
    spam: [{ body: String, date: Date }],
    ham: { type: Date, default: Date.now },
    fizz: String,
    fuzz: {
      favs: Number,
      votes: Number,
    },
  },
  {
    timestamps: true,
  },
);

const Foo = mongoose.model("Foo", fooSchema);

module.exports = Foo;
