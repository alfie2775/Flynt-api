const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  uri: {
    type: String,
    required: true,
    unique: true,
  },
  lang: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    default: "",
  },
  input: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Code", schema);
