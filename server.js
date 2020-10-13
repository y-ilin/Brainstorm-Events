const { timeStamp } = require("console");
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
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
// app.use(app.router);

// Requiring our routes
// require("./controllers/html-routes.js")(app); // Routing will now be served on the front end by React!
require("./controllers/api-routes.js")(app);
require("./controllers/sticky-api-routes.js")(app);

server.listen(app.get("port"), () => {
    console.log(
      `==> 🌎  Server listening on port ${app.get("port")}. Visit http://localhost:${app.get("port")}/ in your browser.`,
    );
});

// On connection to socket.io
io.sockets.on("connection", socket => {
    socket.emit("welcome-waiting-room", "Hello, welcome to the waiting room.");    

    let currentPhase=1;
    let phase1duration=0;
    let phase2duration=0;
    let phase3duration=0;

    const serverTimer = (currentPhaseDuration) => {
      setTimeout(() => {
        console.log(`server: timer ${currentPhase} finished!`);
        // Now continue to next phase, begin for loop again
        currentPhase++;
      }, currentPhaseDuration*1000);
    }

    const beginNextPhase = (currentPhaseDuration) => {
      console.log(`Beginning phase ${currentPhase} for ${currentPhaseDuration} seconds!`);
      // Tell all clients to begin phase countdown
      io.sockets.emit("begin-phase", {currentPhase: currentPhase, duration: currentPhaseDuration})
      // Begin phase countdown on server side
      serverTimer(currentPhaseDuration);
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

      // Client side: submit countdown durations
      // Server side: redirect everyone to Phase 1 + start countdown setTimeout + send Phase 1 duration to all clients
      // Client side: setInterval to display the ticking down of seconds
      // Server side: when setTimeout finishes --> redirect everyone to Phase 2 + send Phase 2 duration to all clients
      // Client side: setInterval to dispaly the ticking down of seconds
      // Server side: when setTimeout finishes --> redirect everyone to Phase 3 + send Phase 3 duration to all clients
      // Client side: setInterval to dispaly the ticking down of seconds
      // Server side: when setTIemout finishes --> display "finish" + send snapshot to all clients

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

    // When one user creates a comment on a sticky, broadcast to all other users
    socket.on("send-new-comment", data => {
      socket.broadcast.emit("incoming-new-comment", data)
    })

    // When one user changes the text of a comment, broadcast to all other users
    socket.on("comment-text-change", data => {
      socket.broadcast.emit("incoming-comment-text-change", data)
    })
})
