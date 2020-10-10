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

};
