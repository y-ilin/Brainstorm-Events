const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();

const passport = require("./passport");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// // Creating express app and configuring middleware needed for authentication
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("port", process.env.PORT || 8080);
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);

// Requiring our routes
require("./controllers/html-routes.js")(app);
// require("./controllers/api-routes.js");

server.listen(app.get("port"), () => {
    console.log(
      `==> 🌎  Server listening on port ${app.get("port")}. Visit http://localhost:${app.get("port")}/ in your browser.`,
    );
});

// On connection to socket.io
io.sockets.on("connection", socket => {
    socket.emit("welcome-waiting-room", "Hello, welcome to the waiting room.");
})
