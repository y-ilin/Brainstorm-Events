const Sticky = require("../models/sticky");

const loadStickies = (parent, args, context, info) => {
    return Sticky.find().populate("comments")
}
  
module.exports = {
    loadStickies,
}