const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentId: {
    type: String,
  },
  commentText: {
    type: String,
    default: "",
    trim: true,
  },
  stickyId: {
    type: String,
  },
  sticky: {
    type: Schema.Types.ObjectId,
    ref: "Sticky"
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
