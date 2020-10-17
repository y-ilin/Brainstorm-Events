import React from "react";
import "./style.css";

export function Phase1Intro() {
  return (
    <div className={"phaseIntro phase1"}>
      <div className="introGroup introGroup1">
        <p>Welcome to Phase 1:</p>
        <p>Brainstorming</p>
      </div>
      <div className="introGroup introGroup2">
        <p>Quantity over quality</p>
        <p>Stick all ideas on the board, even if they are not complete thoughts</p>
      </div>
      <div className="introGroup introGroup3">
        <p>👀 All stickies are anonymous 👀</p>
      </div>
    </div>
  );
}

export default Phase1Intro;