const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commenttext: {
    type: String,
    trim: true,
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
