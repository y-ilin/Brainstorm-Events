const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  voters: {
    type: Array,
    default: []
  },
  stickyId: {
    type: String,
  },
  sticky: {
    type: Schema.Types.ObjectId,
    ref: "Sticky"
  }
});

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
