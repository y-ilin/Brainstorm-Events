import React, { useContext, useState, useEffect } from "react";
import "./whiteboard.css";
import UserContext from "../utils/UserContext";
import PhaseIntro from "../components/PhaseIntro";
import Prompt from "../components/Prompt";
import StickyContainer from "../components/StickyContainer";
import Timer from "../components/Timer";
import SocketContext from "../utils/SocketContext";

function Whiteboard(props) {
  const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  // State to manage which phase the event is in, or if the event is completed
  const [currentPhase, setCurrentPhase] = useState(0);
  // Manage whether to show the intro to the next phase
  const [showIntro, setShowIntro] = useState(true);
  // Manage whether to show the very first intro
  const [showFirstIntro, setShowFirstIntro] = useState(true);
  // Prompt to show at top of screen
  const [prompt, setPrompt] = useState("")

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

    socket.on("set-prompt", data => {
      setPrompt(data.prompt)
    })

    socket.on("give-phase-intro", () => {
      // Show the intro
      setShowIntro(true)
    })

    socket.on("begin-phase", data => {
      console.log("beginning phase with data: ", data)
      setCurrentPhase(data.currentPhase);
      setShowIntro(false);
      setShowFirstIntro(false);
    })

    socket.on("show-final-whiteboard", () => {
      setCurrentPhase("finished");
      setShowIntro(false);
    })
  }, []);

  // const handleNextPhase = e => {
  //   e.preventDefault();
  //   console.log("Begin next phase")
  //   socket.emit("begin-next-phase");
  //   setShowFirstIntro(false);
  // }


  return (
    <div className={"whiteboard phase"+currentPhase} currentPhase={currentPhase}>
      <div className={"blotch blotch1"} currentPhase={currentPhase}></div>
      <div className={"blotch blotch2"} currentPhase={currentPhase}></div>
      <div className={"blotch blotch3"} currentPhase={currentPhase}></div>
      <Timer />
      <Prompt
        prompt={props.prompt}
      />
      <StickyContainer
        currentPhase={currentPhase}
      />
      { showIntro
      ? <PhaseIntro
        currentPhase={currentPhase}
        showFirstIntro={showFirstIntro}
        setShowFirstIntro={setShowFirstIntro}
        showIntro={showIntro}
        />
      : null
      }
    </div>
  );
}

export default Whiteboard;
