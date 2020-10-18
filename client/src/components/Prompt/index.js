import React from "react";
import "./style.css";

export function Prompt(props) {

  return (
    <div id="promptDiv">
      <p>{props.prompt}</p>
    </div>
  );
}

export default Prompt;