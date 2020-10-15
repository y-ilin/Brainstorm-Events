// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating our User model
const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: "First name is required"
  },
  lastName: {
    type: String,
    trim: true,
    required: "Last name is required"
  },
  email: {
    type: String,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    required: "Email is Required"
  },
  password: {
    type: String,
    trim: true,
    required: "Password is Required",
  },
  userCreated: {
    type: Date,
    default: Date.now
  },
  stickiesVotedFor: {
    type: Schema.Types.ObjectId,
    ref: "Sticky"
  }
});

// Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
// Hooks are automatic methods that run during various phases of the User Model lifecycle
// In this case, before a User is created, we will automatically hash their password
userSchema.pre("save", function(next) {
  this.password = bcrypt.hashSync(
    this.password,
    bcrypt.genSaltSync(10),
    null
  );
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
