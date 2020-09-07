const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Enter a name for this account"
  },
  email: {
    type: String,
    trim: true,
    required: "Enter an email for this account"
  },
  password: {
    type: String,
    trim: true,
    required: "Enter an password for this account"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
