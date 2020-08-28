const mongoose = require("mongoose");

const adminSchemer = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  admin: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Admin", adminSchemer);
