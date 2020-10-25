import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import SocketContext from "../utils/SocketContext";
import "./Dashboard.css";
import "font-awesome/css/font-awesome.min.css";
import API from "../utils/API";
import brainstormIcon from "../utils/icons/brainstormIcon.svg";
import buildIcon from "../utils/icons/buildIcon.svg";
import voteIcon from "../utils/icons/voteIcon.svg";

function Dashboard(props) {
  // For directing all users to the whiteboard at the same time
  let history = useHistory();
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
    // API.createEvent()
    // When user lands on dashboard, fetch all data for this event    
    API.getEventDetails()
      .then(res => {
        console.log(res.data)
      })

    // When a user has changed the durations, prompt all other users to fetch that data from server
    socket.on("incoming-durations", () => {
      API.getEventDetails()
        .then(res => {
          setDurations({
            phase1duration: res.data[0].duration1,
            phase2duration: res.data[0].duration2,
            phase3duration: res.data[0].duration3,
          })
        })
      setDurationsDone(true)
    })

    // Move user to whiteboard because another user has started the event
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

    if (durations.phase1duration !== 0 && durations.phase2duration !== 0 && durations.phase3duration !== 0) {
      setDurationsDone(true)
    } else {
      setDurationsDone(false)
    }

    // Tell all other users to fetch new durations data
    socket.emit("sendCountdownDurations", durations);

    // Save phase durations to database
    API.setDurations(durations)
      .then(data => {
        console.log("finished setting durations in database", data)
      })
  }

  const handlePromptSubmit = e => {
    e.preventDefault();
    props.setPrompt(prompt)

    // Send to server to broadcast prompt to every other user
    socket.emit("submit-prompt", prompt)

    // Save prompt to database
    API.setPrompt({prompt})

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
      <div className="dashboardTitleDiv">
        <h1 className="dashboardTitle">Welcome to the waiting room</h1>
      </div>
      <div className="dashboardDiv">
        <form className="formDiv">
          <p className="formDivTitle">Brainstorm prompt:</p>
          <div id="promptForm">
            <input
              onChange={handlePromptChange}
              value={props.prompt ? props.prompt : undefined}
              type="text"
              name="promptInput"
              id="promptInput"
              placeholder="Orient the team, what are we brainstorming ideas for?"
            />
            <input
              onClick={handlePromptSubmit}
              type="submit"
              value="Submit"
              className="formSubmitBtn"
            />
            { promptDone
              ? <i className="fa fa-check-circle done"></i>
              : <i className="fa fa-check-circle"></i>
            }
          </div>
        </form>
        <form className="formDiv">
          <p className="formDivTitle">How long should each phase go for?</p>
          <div id="countdownForm">
            <div className="phaseDiv">
              <img src={brainstormIcon} alt="sticky note icon" className="phaseIcon"/>
              <p>BRAINSTORM</p>
              <input
                // value={durations.phase1duration}
                onChange={handleDurationChange}
                value={durations.phase1duration ? durations.phase1duration : undefined}
                type="number"
                name="phase1duration"
                id="phase1duration"
                placeholder="Phase 1 (minutes)"
              />
            </div>
            <div className="phaseDiv">
              <img src={buildIcon} alt="add sticky note icon" className="phaseIcon"/>
              <p>BUILD</p>
              <input
                // value={durations.phase2duration}
                onChange={handleDurationChange}
                value={durations.phase2duration ? durations.phase2duration : undefined}
                type="number"
                name="phase2duration"
                id="phase2duration"
                placeholder="Phase 2 (minutes)"
              />
            </div>
            <div className="phaseDiv">
              <img src={voteIcon} alt="vote icon" className="phaseIcon"/>
              <p>VOTE</p>
              <input
                // value={durations.phase3duration}
                onChange={handleDurationChange}
                value={durations.phase3duration ? durations.phase3duration : undefined}
                type="number"
                name="phase3duration"
                id="phase3duration"
                placeholder="Phase 3 (minutes)"
              />
            </div>
            <div className="phaseDiv">
              <div className="submitDiv">
                <input
                  onClick={handleTimerFormSubmit}
                  type="submit"
                  value="Set phase durations"
                  className="formSubmitBtn"
                ></input>
                { durationsDone
                  ? <i className="fa fa-check-circle done"></i>
                  : <i className="fa fa-check-circle"></i>
                }
              </div>
            </div>
          </div>
        </form>
        <div id="whiteboardButtonDiv">
          <Link
            to="/whiteboard"
            id="whiteboardButton"
            onClick={handleGoToWhiteboard}
          >
            START EVENT →
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