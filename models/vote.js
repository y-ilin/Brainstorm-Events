const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  voteCount: {
    type: Number
  }
});

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
