import React from "react";
import "./style.css";

export function Timer(props) {
  const timeLeft = props.timeLeft;
  const minutes = Math.floor(timeLeft/60);
  const seconds = ("0" + timeLeft%60).slice(-2);

  return (
    <div id="timerDiv">
      {minutes} : {seconds}
    </div>
  );
}

export default Timer;