const mongoose = require("mongoose");

const podcastSchemer = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
  },
  description: {
    type: String
  },
  by: {
   type: String
  }, 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("Podcast", podcastSchemer);
