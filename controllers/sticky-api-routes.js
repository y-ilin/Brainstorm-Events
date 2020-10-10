// Requiring our models and passport as we've configured it
// const db = require("../models");
const Sticky = require("../models/sticky");

module.exports = function(app) {
  // Get all stickies
  app.get("/api/sticky", (req, res) => {
   Sticky.find().then(data => {
      res.json(data);
    });
  });

  // Create a sticky
  app.post("/api/sticky", (req, res) => {
    Sticky.create({
      stickyText: req.body.stickyText,
      x: 50,
      y: 50,
    })
      .then(data => {
        res.json(data);
      })
  });

  // Move a sticky
  app.post("/api/movesticky", (req, res) => {
    console.log(req.body.x)
    Sticky.updateOne({_id: req.body.stickyId}, {$set: {x: req.body.x, y: req.body.y}}, () => {
      Sticky.findOne({_id: req.body.stickyId}, (err, docs) => console.log(docs))
    })
    .catch(err => console.log(err))
  })
};
