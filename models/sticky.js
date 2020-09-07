const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stickySchema = new Schema({
  noteText: {
    type: String,
    trim: true,
  },
  xCoord: {
    type: Number,
  },
  yCoord: {
    type: Number,
  },
  noteColor: {
    type: String,
  }
});

const Sticky = mongoose.model("Sticky", stickySchema);

module.exports = Sticky;
