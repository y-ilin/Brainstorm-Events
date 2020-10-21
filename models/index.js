const User = require("./user.js");
const Sticky = require("./sticky.js");
const Comment = require("./comment.js");
const Vote = require("./vote.js");
const EventDetails = require("./eventDetails");

const db = {
    User,
    Sticky,
    Comment,
    Vote,
    EventDetails
}

module.exports = db;