import React from "react";
import "./style.css";

export function Phase2Intro() {
  return (
    <div className={"phaseIntro phase2"}>
      <div className="introGroup introGroup1">
        <p>Welcome to Phase 2:</p>
        <p>Building</p>
      </div>
      <div className="introGroup introGroup2">
        <p>Bring each other's ideas to the next level</p>
        <p>You can now access comments</p>
      </div>
      <div className="introGroup introGroup3">
        <p>👀 All stickies are anonymous 👀</p>
      </div>
    </div>
  );
}

export default Phase2Intro;