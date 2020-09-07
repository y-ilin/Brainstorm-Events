const socket = io.connect("http://localhost:3000");

socket.on("welcome-waiting-room", data => {
    console.log(data);
})