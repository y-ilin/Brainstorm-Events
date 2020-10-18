import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import SocketContext from "../utils/SocketContext";
import "./Dashboard.css";
import "font-awesome/css/font-awesome.min.css";

function Dashboard(props) {
  let history = useHistory();
  // const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  // Prompt to show at top of screen
  const [prompt, setPrompt] = useState("")
  // Set up state to track what user inputs for each phase duration
  const [durations, setDurations] = useState({
    phase1duration: 0,
    phase2duration: 0,
    phase3duration: 0,
  })
  
  // Track if a prompt has been submitted
  const [promptDone, setPromptDone] = useState(false)
  // Track if a phase durations have been submitted
  const [durationsDone, setDurationsDone] = useState(false)

  useEffect(() => {
    if (props.prompt) {
      setPromptDone(true)
    }
  }, [props.prompt])

  useEffect(() => {
    socket.on("incoming-durations", data => {
      setDurations({
        phase1duration: data.phase1duration,
        phase2duration: data.phase2duration,
        phase3duration: data.phase3duration,
      })
      setDurationsDone(true)
    })

    socket.on("moving-you-to-whiteboard", () => {
      history.push("/whiteboard")
    })

    if (props.prompt!=="") {
      setPromptDone(true)
    }
  }, [])

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
    if (durations.phase1duration !== 0 && durations.phase2duration !== 0 && durations.phase3duration !== 0) {
      setDurationsDone(true)
    } else {
      setDurationsDone(false)
    }

    // Send phase durations to server
    socket.emit("sendCountdownDurations", durations);
  }

  const handlePromptSubmit = e => {
    e.preventDefault();
    props.setPrompt(prompt)
    socket.emit("submit-prompt", prompt)
    if (prompt !== "") {
      setPromptDone(true)
    } else {
      setPromptDone(false)
    }
  }

  const handleGoToWhiteboard = () => {
    socket.emit("go-to-whiteboard")
  }

  return (
    <div className="dashboardBackground">
      <div className="dashboardDiv">
        <h1>Welcome to the waiting room</h1>
        <form id="promptForm">
          <p>Brainstorm prompt:</p>
          <div id="promptFormDiv">
            <input
              onChange={handlePromptChange}
              value={props.prompt ? props.prompt : undefined}
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
            { promptDone
              ? <i className="fa fa-check-circle done"></i>
              : <i className="fa fa-check-circle"></i>
            }
          </div>
        </form>
        <form id="countdownForm">
          <p>How long should each phase go for?</p>
          <div id="countdownFormDiv">
            <input
              // value={durations.phase1duration}
              onChange={handleDurationChange}
              value={durations.phase1duration ? durations.phase1duration : undefined}
              type="number"
              name="phase1duration"
              id="phase1duration"
              placeholder="Phase 1 (minutes)"
            />
            <input
              // value={durations.phase2duration}
              onChange={handleDurationChange}
              value={durations.phase2duration ? durations.phase2duration : undefined}
              type="number"
              name="phase2duration"
              id="phase2duration"
              placeholder="Phase 2 (minutes)"
            />
            <input
              // value={durations.phase3duration}
              onChange={handleDurationChange}
              value={durations.phase3duration ? durations.phase3duration : undefined}
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
            { durationsDone
              ? <i className="fa fa-check-circle done"></i>
              : <i className="fa fa-check-circle"></i>
            }
          </div>
        </form>
        <div id="whiteboardButtonDiv">
          <Link
            to="/whiteboard"
            id="whiteboardButton"
            onClick={handleGoToWhiteboard}
          >
            Go to whiteboard!
          </Link>
          {/* { promptDone && durationsDone
            ? <Link
              to="/whiteboard"
              id="whiteboardButton"
              >
                Go to whiteboard!
              </Link>
            : <div
            id="whiteboardButton"
            >
              Go to whiteboard!
            </div>
          } */}
         
        </div>
      </div>
    </div>
  );
}

export default Dashboard;