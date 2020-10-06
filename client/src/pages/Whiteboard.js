import React, { useContext, useState, useEffect, useMemo } from "react";
// import "./style.css";
import io from "socket.io-client";
import UserContext from "../utils/UserContext";
import Phase1 from "../components/Phase1";
import Phase2 from "../components/Phase2";
import Phase3 from "../components/Phase3";

function Whiteboard() {
  const userData = useContext(UserContext);

  // State to manage which phase the event is in, or if the event is completed
  const [currentPhase, setCurrentPhase] = useState(1);

  // Connect to socket.io
  const socket = useMemo(() => {
    return io.connect()
  }, []);

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

      // // If we're in one of the 3 phases, load the phase page and features,
      // // and start the relevant coutndown
      // if (currentPhase===1 || currentPhase===2 || currentPhase===3) {
      //   let timeLeft = data.duration;

      //   // Start countdown
      //   const countdown = setInterval(() => {
      //     timeLeft--;
      //     console.log(timeLeft); // This time to later be displayed on DOM
  
      //     // If time runs out, clear the countdown interval
      //     if (timeLeft <= 0) {
      //       console.log("client: phase complete")
      //       clearInterval(countdown);
      //     }
      //   }, 1000)
      // } else {
      //   // If we have finished the 3 phases, load finishing page
      //   console.log("now to load finishing page!")
      // }

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

  // Tell server to start countdown with the 3 durations provided by user

  // // Countdown
  // const startCountdown = (phasedurations) => {
  //     // Tell server to startCountdown with given phase durations
  //     socket.emit("startCountdown", phasedurations);
  // }


  // // On form submit, start countdown
  // $("#countdownForm").on("submit", (e) => {
  //     e.preventDefault();
  //     console.log("form submitted");
  //     // Get user's input for phase durations
  //     const phasedurations = {
  //         phase1duration: $("#phase1duration").val(),
  //         phase2duration: $("#phase2duration").val(),
  //         phase3duration: $("#phase3duration").val(),
  //     }
  //     // Feed phase duration data to startCountdown function
  //     startCountdown(phasedurations);
  // });

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

        { renderPhase() }

        <button onClick={handleNextPhase}>Start Next Phase</button>
    </form>
      </div>
  );
}

export default Whiteboard;
