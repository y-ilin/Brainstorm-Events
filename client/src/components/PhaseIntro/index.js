import React, { useContext } from "react";
import "./style.css";
import Phase1Intro from "../Phase1Intro";
import Phase2Intro from "../Phase2Intro";
import Phase3Intro from "../Phase3Intro";
import PhaseFinish from "../PhaseFinish";
import SocketContext from "../../utils/SocketContext";


export function PhaseIntro(props) {
  const socket = useContext(SocketContext);

  const handleNextPhase = e => {
    e.preventDefault();
    console.log("Begin next phase")
    socket.emit("begin-next-phase");
    props.setShowFirstIntro(false);
  }

  const renderPhaseIntro = () => {
    if (props.showFirstIntro) {
      return <Phase1Intro />
    } else if (props.currentPhase === 1) {
      return <Phase2Intro />
    } else if (props.currentPhase === 2) {
      return <Phase3Intro />
    } else if (props.currentPhase === 3) {
      return <PhaseFinish />
    }
  }

  return (
    <div className="phaseIntroBackground">
      { renderPhaseIntro() }
      <button
        onClick={handleNextPhase}
        className="nextPhaseButton"
      >
        Start Next Phase
      </button>
    </div>
  );
}

export default PhaseIntro;