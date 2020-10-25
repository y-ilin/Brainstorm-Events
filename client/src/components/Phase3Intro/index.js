import React from "react";
import "./style.css";

export function Phase3Intro() {
  return (
    <div className={"phaseIntro phase3"}>
      <div className="introGroup introGroup1">
        <p>Welcome to Phase 3:</p>
        <p className="phaseTitle">VOTING</p>
      </div>
      <div className="introGroup introGroup2">
        <p>Which ideas should we explore?</p>
        <p>Have your say</p>
      </div>
      <div className="introGroup introGroup3">
        <p>👀 All stickies are anonymous 👀</p>
      </div>
    </div>
  );
}

export default Phase3Intro;