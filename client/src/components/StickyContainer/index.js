import React, { useState, useEffect } from "react";
import { gql, useQuery } from '@apollo/client';

import "./style.css";
import NewStickyForm from "../NewStickyForm";
import Sticky from "../Sticky";
// import API from "../../utils/API";
// import UserContext from "../../utils/UserContext";

export function StickyContainer(props) {
  // State to track all the stickies on the whiteboard
  const [allStickies, setAllStickies] = useState([]);

  // On load, get all the stickies from the database
  // useEffect(() => {
  //   API.loadStickies()
  //     .then(res => {setAllStickies(res.data)
  //  //    console.log(res.data)})
  // }, [])

  const GET_ALL_STICKIES = gql`
    query {
      loadStickies {
        stickyId
        stickyText
        comments {
          commentId
          commentText
          stickyId
        }
        voters
        x
        y
      }
    }
  `;
  const { loading, data: loadedStickies } = useQuery(GET_ALL_STICKIES);

  console.log({loadedStickies})
  
  useEffect(() => {
    if(!loading) {
      console.log("done loading ", allStickies)
      setAllStickies(loadedStickies.loadStickies)
    }
  }, [loading])


  return (
    <div className="stickyContainer">
      { props.currentPhase === 1 || props.currentPhase === "finished"
      ? <NewStickyForm
        allStickies={allStickies}
        setAllStickies={setAllStickies}
        />
      : null
      }
      {allStickies ? allStickies.map(sticky => {
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
      }) : null}
    </div>
  );
}

export default StickyContainer;