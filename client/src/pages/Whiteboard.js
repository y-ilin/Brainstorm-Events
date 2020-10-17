import React, { useContext, useState, useEffect } from "react";
import "./whiteboard.css";
// import io from "socket.io-client";
import UserContext from "../utils/UserContext";
// import Phase1 from "../components/Phase1";
// import Phase2 from "../components/Phase2";
// import Phase3 from "../components/Phase3";
import PhaseIntro from "../components/PhaseIntro";
import StickyContainer from "../components/StickyContainer";
import SocketContext from "../utils/SocketContext";

function Whiteboard() {
  const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  // State to manage which phase the event is in, or if the event is completed
  const [currentPhase, setCurrentPhase] = useState(0);
  // Manage whether to show the intro to the next phase
  const [showIntro, setShowIntro] = useState(true);
  // Manage whether to show the very first intro
  const [showFirstIntro, setShowFirstIntro] = useState(true);

  // When client enters the Whiteboard, ask server to get client up to speed on
  // what phase the whole team is currently in

  // On page load
  useEffect(() => {
    socket.emit("enter-whiteboard")
    socket.on("welcome-whiteboard", data => setCurrentPhase(data.currentPhase))

    socket.on("welcome-waiting-room", data => {
      console.log(userData);
      console.log(data);
    });

    socket.on("give-phase-intro", () => {
      // Show the intro
      setShowIntro(true)
    })

    socket.on("begin-phase", data => {
      console.log("beginning phase with data: ", data)
      setCurrentPhase(data.currentPhase);
      setShowIntro(false);

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

  // const handleNextPhase = e => {
  //   e.preventDefault();
  //   console.log("Begin next phase")
  //   socket.emit("begin-next-phase");
  //   setShowFirstIntro(false);
  // }
  
  return (
    <div className={"whiteboard phase"+currentPhase}>
      <StickyContainer
        currentPhase={currentPhase}
      />
      { showIntro
      ? <PhaseIntro
        showFirstIntro={showFirstIntro}
        currentPhase={currentPhase}
        setShowFirstIntro={setShowFirstIntro}
        />
      : null
      }
      {/* <button onClick={handleNextPhase}>Start Next Phase</button> */}
    </div>
  );
}

export default Whiteboard;
