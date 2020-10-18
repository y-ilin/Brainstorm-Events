const { timeStamp } = require("console");
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/brainstormEvents", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

const passport = require("./scripts/passport");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// // Creating express app and configuring middleware needed for authentication
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// app.use(express.static("public"));
app.set("port", process.env.PORT || 8080);

// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Requiring our api routes
require("./controllers/api-routes.js")(app);
require("./controllers/sticky-api-routes.js")(app);
// If no api routes are hit, send the front end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
})

server.listen(app.get("port"), () => {
    console.log(
      `==> 🌎  Server listening on port ${app.get("port")}. Visit http://localhost:${app.get("port")}/ in your browser.`,
    );
});

// On connection to socket.io
io.sockets.on("connection", socket => {
    socket.on("enter-whiteboard", () => {
      socket.emit("welcome-whiteboard", {currentPhase: currentPhase})
    })
    
    socket.emit("welcome-waiting-room", "Hello, welcome to the waiting room.");    

    let currentPhase=1;
    let phase1duration=0;
    let phase2duration=0;
    let phase3duration=0;

    // const serverTimer = (currentPhaseDuration) => {
    //   const serverTimeout = setTimeout(() => {
    //     console.log(`server: timer ${currentPhase} finished!`);
    //     // Now continue to next phase, begin for loop again
    //     currentPhase++;

    //     if (currentPhase > 3) {
    //       // Reset phase and phase durations
    //       currentPhase=1;
    //       // phase1duration=0;
    //       // phase2duration=0;
    //       // phase3duration=0;
    //     } else {
    //       // Tell all clients to show next phase intro
    //       io.sockets.emit("give-phase-intro")
    //     }

    //   }, currentPhaseDuration*1000*60); // in minutes
    // }
    const serverTimeout = (currentPhaseDuration) => {
      const serverTimer = setTimeout(() => {
        // Clear any existing timer
        clearTimeout(serverTimer)
        console.log("clearing any previous timers")

        console.log(`server: timer ${currentPhase} finished!`);
        // Now continue to next phase, begin for loop again
        currentPhase++;

        // if (currentPhase > 3) {
        //   // Reset phase and phase durations
        //   currentPhase=1;
        //   phase1duration=0;
        //   phase2duration=0;
        //   phase3duration=0;
        // } else {
          // Tell all clients to show next phase intro
          io.sockets.emit("give-phase-intro")
        // }

      }, currentPhaseDuration*1000*60); // in minutes
    }

    const beginNextPhase = (currentPhaseDuration) => {
      console.log(`Beginning phase ${currentPhase} for ${currentPhaseDuration*60} seconds!`);
      // Tell all clients to begin phase countdown
      io.sockets.emit("begin-phase", {currentPhase: currentPhase, duration: currentPhaseDuration*60}) // in ms * minutes

      // Begin phase countdown on server side
      serverTimeout(currentPhaseDuration);

      // const serverExists = true;
    }

    socket.on("begin-next-phase", () => {
      let phaseDuration = 0;
      if (currentPhase===1) {
        phaseDuration = phase1duration;
      } else if (currentPhase===2) {
        phaseDuration = phase2duration;
      } else if (currentPhase===3) {
        phaseDuration = phase3duration;
      }
      beginNextPhase(phaseDuration);
    })

    socket.on("sendCountdownDurations", data => {
      console.log("data is: ", data);

      // Store countdown duration data given by user
      phase1duration = data.phase1duration;
      phase2duration = data.phase2duration;
      phase3duration = data.phase3duration;      
    })

    // When one user creates new sticky, broadcast to all other users
    socket.on("send-new-sticky", data => {
      socket.broadcast.emit("incoming-new-sticky", data)
    })

    // When one user moves a sticky, broadcast to all other users
    socket.on("sticky-move", data => {
      socket.broadcast.emit("incoming-sticky-move", data)
    })

    // When one user changes the text of a sticky, broadcast to all other users
    socket.on("sticky-text-change", data => {
      socket.broadcast.emit("incoming-sticky-text-change", data)
    })

    // When one user deletes a sticky, broadcast to all other users
    socket.on("delete-sticky", data => {
      socket.broadcast.emit("incoming-delete-sticky", data)
    })

    // When one user creates a comment on a sticky, broadcast to all other users
    socket.on("send-new-comment", data => {
      socket.broadcast.emit("incoming-new-comment", data)
    })

    // When one user changes the text of a comment, broadcast to all other users
    socket.on("comment-text-change", data => {
      socket.broadcast.emit("incoming-comment-text-change", data)
    })

    // When one user adds a vote, broadcast to all other users
    socket.on("add-vote", data => {
      socket.broadcast.emit("incoming-add-vote", data)
    })

    // When one user removes a vote, broadcast to all other users
    socket.on("remove-vote", data => {
      socket.broadcast.emit("incoming-remove-vote", data)
    })

    // When a user moves to the whiteboard after the event, move all users
    socket.on("client-finished-phases", () => {
      io.sockets.emit("show-final-whiteboard")
    })

    // When a user submits a prompt
    socket.on("submit-prompt", data => {
      console.log(data)
      io.sockets.emit("incoming-prompt", data)
    })
})
