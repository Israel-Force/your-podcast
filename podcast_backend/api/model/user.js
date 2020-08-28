const mongoose = require("mongoose");

const userSchemer = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  joined: {
    type: Date
  },
  googleId: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchemer);
