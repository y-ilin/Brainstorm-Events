import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import SocketContext from "../../utils/SocketContext";

export function Timer() {
  const socket = useContext(SocketContext);

  // Track time left in each phase
  const [timeLeftState, setTimeLeftState] = useState(0);

  
  useEffect(() => {
    socket.on("begin-phase", data => {
      let timeLeft = data.duration;

      // Start countdown
      const countdown = setInterval(() => {
        timeLeft--;
        setTimeLeftState(timeLeft)
        console.log(timeLeft); // This time to later be displayed on DOM

        // If time runs out, clear the countdown interval
        if (timeLeft <= 0) {
          console.log("client: phase complete")
          clearInterval(countdown);
        }
      }, 1000)
    })
  }, [])

  const minutes = Math.floor(timeLeftState/60);
  const seconds = ("0" + timeLeftState%60).slice(-2);

  return (
    <div id="timerDiv">
      {minutes} : {seconds}
    </div>
  );
}

export default Timer;