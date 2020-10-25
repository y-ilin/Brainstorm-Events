import React from "react";
import "./style.css";

export function PhaseFinish() {
  return (
    <div className={"phaseIntro phaseFinish"}>
      <div className="introGroup introGroup1">
        <p className="phaseTitle">CONGRATULATIONS</p>
      </div>
      <div className="introGroup introGroup2">
        <p>You have completed the event!</p>
        <p>Go back to the whiteboard to see your team's work</p>
      </div>
    </div>
  );
}

export default PhaseFinish;