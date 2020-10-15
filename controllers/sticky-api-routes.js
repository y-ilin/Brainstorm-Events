// Requiring our models and passport as we've configured it
// const db = require("../models");
const Sticky = require("../models/sticky");
const Comment = require("../models/comment");

module.exports = function(app) {
  // Get all stickies
  app.get("/api/sticky", (req, res) => {
   Sticky.find().populate("comments")
    .then(data => res.json(data));
  });

  // Create a sticky
  app.post("/api/sticky", (req, res) => {
    Sticky.create({
      stickyId: req.body.stickyId,
      stickyText: req.body.stickyText,
      x: 50,
      y: 50,
    })
      .then(data => res.json(data));
  });

  // Move a sticky
  app.post("/api/movesticky", (req, res) => {
    Sticky.updateOne({stickyId: req.body.stickyId}, {$set: {x: req.body.x, y: req.body.y}}, err => {
      if (err) console.log(err)
    })
  })

  // Change a sticky's text
  app.post("/api/changestickytext", (req, res) => {
    Sticky.updateOne({stickyId: req.body.stickyId}, {$set: {stickyText: req.body.stickyTextContent}}, err => {
      if (err) console.log(err)
    })
  })

  // Delete a sticky
  app.post("/api/deletesticky", (req, res) => {
    Sticky.deleteOne({stickyId: req.body.stickyId}, err => {
      if (err) console.log(err)
    })
  })

  // Create a comment on a sticky
  app.post("/api/comment", (req, res) => {
    Comment.create({
      commentId: req.body.commentId,
      stickyId: req.body.stickyId,
    })
      .then(({_id, stickyId}) => Sticky.findOneAndUpdate({stickyId: stickyId}, { $push: { comments: _id } }, { new: true }));
  });

  // Change a comment's text
  app.post("/api/changecommenttext", (req, res) => {
    Comment.findOneAndUpdate({commentId: req.body.commentId}, { $set: {commentText: req.body.commentTextContent} }, err => {
      if (err) console.log(err)
    })
  })

};
