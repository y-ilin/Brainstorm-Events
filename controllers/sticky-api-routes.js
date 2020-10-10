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
      stickyId: req.body.stickyId,
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
    Sticky.updateOne({stickyId: req.body.stickyId}, {$set: {x: req.body.x, y: req.body.y}}, () => {
      Sticky.findOne({stickyId: req.body.stickyId})
    })
    .catch(err => console.log(err))
  })

  // Change a sticky's text
  app.post("/api/changestickytext", (req, res) => {
    Sticky.updateOne({stickyId: req.body.stickyId}, {$set: {stickyText: req.body.stickyTextContent}}, () => {
      Sticky.findOne({stickyId: req.body.stickyId})
    })
    .catch(err => console.log(err))
  })
};
