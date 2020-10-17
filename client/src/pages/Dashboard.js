import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import SocketContext from "../utils/SocketContext";

function Dashboard() {
  // const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  // // State to manage which phase the event is in, or if the event is completed
  // const [currentPhase, setCurrentPhase] = useState(1);

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

  return (
    <div>
      <h1>This is your dashboard</h1>
      <Link to="/whiteboard">Go to whiteboard!</Link>
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
    </div>
  );
}

export default Dashboard;
