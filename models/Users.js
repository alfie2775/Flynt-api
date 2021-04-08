const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },
    savedCodes: [
      new mongoose.Schema({
        codeName: { type: String, required: true },
        lang: { type: String, required: true },
        code: { type: String, required: true },
        input: { type: String, default: "" },
      }),
    ],
    templates: [
      new mongoose.Schema({
        lang: { type: String, required: true },
        code: { type: String },
      }),
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(require("passport-local-mongoose"));

module.exports = mongoose.model("User", userSchema);
