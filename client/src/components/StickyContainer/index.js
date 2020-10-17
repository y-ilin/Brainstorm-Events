import React, { useState, useEffect } from "react";
import "./style.css";
import NewStickyForm from "../NewStickyForm";
import Sticky from "../Sticky";
import API from "../../utils/API";
import UserContext from "../../utils/UserContext";

export function StickyContainer(props) {
  // State to track all the stickies on the whiteboard
  const [allStickies, setAllStickies] = useState([]);

  // On load, get all the stickies from the database
  useEffect(() => {
    API.loadStickies()
      .then(res => setAllStickies(res.data))
  }, [])

  return (
    <div className="stickyContainer">
      <p>This is the sticky container</p>
      { props.currentPhase === 1
      ? <NewStickyForm
        allStickies={allStickies}
        setAllStickies={setAllStickies}
        />
      : null
      }
      {allStickies.map(sticky => {
        return <Sticky
          key={sticky.stickyId}
          stickyId={sticky.stickyId}
          stickyText={sticky.stickyText}
          x={sticky.x}
          y={sticky.y}
          comments={sticky.comments}
          voters={sticky.voters}
          allStickies={allStickies}
          setAllStickies={setAllStickies}
          currentPhase={props.currentPhase}
        />
      })}
    </div>
  );
}

export default StickyContainer;