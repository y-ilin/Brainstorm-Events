const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stickySchema = new Schema({
  stickyId: {
    type: String,
  },
  stickyText: {
    type: String,
    trim: true,
  },
  x: {
    type: Number,
    default: 50,
  },
  y: {
    type: Number,
    default: 50,
  },
  noteColor: {
    type: String,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    // type: Schema.Types.commentId,
    ref: "Comment"
  }]
});

const Sticky = mongoose.model("Sticky", stickySchema);

module.exports = Sticky;
