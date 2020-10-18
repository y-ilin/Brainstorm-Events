import React from "react";
import "./style.css";

export function PhaseFinish() {
  return (
    <div className={"phaseIntro phaseFinish"}>
      <div className="introGroup introGroup1">
        <p>Congratulations</p>
        <p>You have completed the event!</p>
      </div>
      <div className="introGroup introGroup2">
        <p>Go back to the whiteboard to see your team's work</p>
      </div>
    </div>
  );
}

export default PhaseFinish;