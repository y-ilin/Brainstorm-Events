const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/userdb", { useNewUrlParser: true });

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

server.listen(app.get("port"), () => {
    console.log(
      `==> 🌎  Server listening on port ${app.get("port")}. Visit http://localhost:${app.get("port")}/ in your browser.`,
    );
});

// On connection to socket.io
io.sockets.on("connection", socket => {
    socket.emit("welcome-waiting-room", "Hello, welcome to the waiting room.");
})
