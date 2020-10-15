import React from "react";
import "./style.css";

export function VoteCount(props) {
  // Count the number of voters for this sticky
  const voteCount = () => props.allVoters ? props.allVoters.length : 0;

  return (
    <div>{voteCount()}</div>
  );
}

export default VoteCount;