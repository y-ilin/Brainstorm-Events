const socket = io.connect("http://localhost:8080");

socket.on("welcome-waiting-room", data => {
    console.log(data);
})

$( document ).ready(function() {
    // Countdown
    const startCountdown = (phasedurations) => {
        // Tell server to startCountdown with given phase durations
        socket.emit("startCountdown", phasedurations);
    }


    // On form submit, start countdown
    $("#countdownForm").on("submit", (e) => {
        e.preventDefault();
        console.log("form submitted");
        // Get user's input for phase durations
        const phasedurations = {
            phase1duration: $("#phase1duration").val(),
            phase2duration: $("#phase2duration").val(),
            phase3duration: $("#phase3duration").val(),
        }
        // Feed phase duration data to startCountdown function
        startCountdown(phasedurations);
    });


})

