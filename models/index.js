const User = require("./user.js");
const Sticky = require("./sticky.js");
const Comment = require("./comment.js");
const Vote = require("./vote.js");

const db = {
    User,
    Sticky,
    Comment,
    Vote
}

module.exports = db;