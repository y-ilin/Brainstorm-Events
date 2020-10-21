// Requiring our models and passport as we've configured it
// const db = require("../models");
const EventDetails = require("../models/eventDetails");

module.exports = function(app) {
  // Get all event details
  app.get("/api/eventdetails", (req, res) => {
   EventDetails.find()
    .then(data => {
      console.log(data)
      res.json(data)
    })
  });

  app.post("/api/createevent", ({body}, res) => {
    EventDetails.create()
     .then(data => {
       console.log(data)
       res.json(data)
     })
   });

  // Set phase durations
  app.post("/api/setdurations", ({body}, res) => {
    EventDetails.update({}, {$set: {duration1: body.phase1duration, duration2: body.phase2duration, duration3: body.phase3duration}}, err => {
        if (err) console.log(err)
      })
    .then(data => res.json(data));
  });

  // Set event prompt
  app.post("/api/setprompt", ({body}, res) => {
    EventDetails.update({}, {$set: {prompt: body.prompt}}, err => {
      if (err) console.log(err)
    })
  })

};
