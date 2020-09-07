const express = require("express");
const app = express();

// const PORT = process.env.PORT || 3000;
const db = require("./models");

const server = require("http").createServer(app);
const io = require("socket.io")(server);

// // Creating express app and configuring middleware needed for authentication
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("port", process.env.PORT || 3000);
// app.use(app.router);

// // Requiring our routes
// require("./controllers/html-routes.js");
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
