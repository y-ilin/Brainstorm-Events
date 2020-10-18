const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventDetailsSchema = new Schema({
  duration1: {
    type: Number,
    default: 0,
  },
  duration2: {
    type: Number,
    default: 0,
  },
  duration3: {
    type: Number,
    default: 0,
  },
  currentPhase: {
    type: String,
    default: 1,
  },
  prompt: {
    type: String,
    default: "",
  },
});

const EventDetails = mongoose.model("EventDetails", eventDetailsSchema);

module.exports = EventDetails;
