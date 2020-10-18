import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import SocketContext from "../utils/SocketContext";
import "./Dashboard.css";

function Dashboard(props) {
  // const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  // // State to manage which phase the event is in, or if the event is completed
  // const [currentPhase, setCurrentPhase] = useState(1);

  // Prompt to show at top of screen
  const [prompt, setPrompt] = useState("")
  // Set up state to track what user inputs for each phase duration
  const [durations, setDurations] = useState({
    phase1duration: 0,
    phase2duration: 0,
    phase3duration: 0,
  })

  const handlePromptChange = e => {
    console.log(e.target.value)
    setPrompt(e.target.value);
  }

  const handleDurationChange = e => {
    setDurations({
      ...durations,
      [e.target.name]: parseFloat(e.target.value)
    })
  }

  const handleTimerFormSubmit = e => {
    e.preventDefault();
    console.log("time durations submitted: ", durations);

    // Send phase durations to server
    socket.emit("sendCountdownDurations", durations);
  }

  const handlePromptSubmit = e => {
    e.preventDefault();
    props.setPrompt(prompt)
    socket.emit("submit-prompt", prompt)
  }

  return (
    <div className="dashboardBackground">
      <div className="dashboardDiv">
        <h1>Welcome to the waiting room</h1>
        <form id="promptForm">
          <p>Brainstorm prompt:</p>
          <input
            onChange={handlePromptChange}
            type="text"
            name="promptInput"
            id="promptInput"
            placeholder="Orient the team, what are we creating ideas for?"
          />
          <input
            onClick={handlePromptSubmit}
            type="submit"
            value="Submit"
            id="submitPromptBtn"
          />
        </form>
        <form id="countdownForm">
          <p>How long should each phase go for?</p>
          <input
            // value={durations.phase1duration}
            onChange={handleDurationChange}
            type="number"
            name="phase1duration"
            id="phase1duration"
            placeholder="Phase 1 (minutes)"
          />
          <input
            // value={durations.phase2duration}
            onChange={handleDurationChange}
            type="number"
            name="phase2duration"
            id="phase2duration"
            placeholder="Phase 2 (minutes)"
          />
          <input
            // value={durations.phase3duration}
            onChange={handleDurationChange}
            type="number"
            name="phase3duration"
            id="phase3duration"
            placeholder="Phase 3 (minutes)"
          />
          <input
            onClick={handleTimerFormSubmit}
            type="submit"
            value="Set phase durations!"
            id="startCountdownBtn"
          ></input>
        </form>
        <div id="whiteboardButtonDiv">
          <Link
            to="/whiteboard"
            id="whiteboardButton"
          >
            Go to whiteboard!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
