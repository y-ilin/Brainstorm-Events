import React, { useContext, useState, useEffect } from "react";
// import "./style.css";
// import io from "socket.io-client";
import UserContext from "../utils/UserContext";
import Phase1 from "../components/Phase1";
import Phase2 from "../components/Phase2";
import Phase3 from "../components/Phase3";
import StickyContainer from "../components/StickyContainer";
import SocketContext from "../utils/SocketContext";

function Whiteboard() {
  const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  // State to manage which phase the event is in, or if the event is completed
  const [currentPhase, setCurrentPhase] = useState(1);

  // On page load
  useEffect(() => {
    socket.on("welcome-waiting-room", data => {
      console.log(userData);
      console.log(data);
    });

    socket.on("begin-phase", data => {
      console.log("beginning phase with data: ", data)
      setCurrentPhase(data.currentPhase);

      let timeLeft = data.duration;

      // Start countdown
      const countdown = setInterval(() => {
        timeLeft--;
        console.log(timeLeft); // This time to later be displayed on DOM

        // If time runs out, clear the countdown interval
        if (timeLeft <= 0) {
          console.log("client: phase complete")
          clearInterval(countdown);
        }
      }, 1000)
    })

  }, []);
  
  // Set up state to track what user inputs for each phase duration
  const [durations, setDurations] = useState({
    phase1duration: 0,
    phase2duration: 0,
    phase3duration: 0,
  })

  const handleDurationChange = e => {
    setDurations({
      ...durations,
      [e.target.name]: parseInt(e.target.value)
    })
  }

  const handleTimerFormSubmit = e => {
    e.preventDefault();
    console.log("time durations submitted: ", durations);

    // Send phase durations to server
    socket.emit("sendCountdownDurations", durations);
  }

  const handleNextPhase = e => {
    e.preventDefault();
    console.log("Begin next phase")
    socket.emit("begin-next-phase");
  }

  const renderPhase = () => {
    if (currentPhase === 1) {
      return <Phase1 />;
    } else if (currentPhase === 2) {
      return <Phase2 />;
    } else if (currentPhase === 3) {
      return <Phase3 />;
    }
  }
  
  return (
    <div>
      <form id="countdownForm">
        <input
          // value={durations.phase1duration}
          onChange={handleDurationChange}
          type="number"
          name="phase1duration"
          id="phase1duration"
          placeholder="Phase 1 duration"
        />
        <input
          // value={durations.phase2duration}
          onChange={handleDurationChange}
          type="number"
          name="phase2duration"
          id="phase2duration"
          placeholder="Phase 2 duration"
        />
        <input
          // value={durations.phase3duration}
          onChange={handleDurationChange}
          type="number"
          name="phase3duration"
          id="phase3duration"
          placeholder="Phase 3 duration"
        />
        <input
          onClick={handleTimerFormSubmit}
          type="submit"
          value="Start Countdown!"
          id="startCountdownBtn"
        ></input>
      </form>
      { renderPhase() }

      <StickyContainer />

      <button onClick={handleNextPhase}>Start Next Phase</button>
    </div>
  );
}

export default Whiteboard;
