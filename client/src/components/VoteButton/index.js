import React, { useState, useEffect, useContext, useMemo } from "react";
import API from "../../utils/API";
import "./style.css";
import UserContext from "../../utils/UserContext";
import SocketContext from "../../utils/SocketContext";

export function VoteButton(props) {
  const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("all voters are now: ", props.allVoters)
    // When another user adds a vote
    socket.on("incoming-add-vote", data => {
      console.log("someomne added a vote", props.allVoters, data.userId)
      // If that sticky is this current sticky, add the vote
      if (data.stickyId === props.stickyId && !props.allVoters.includes(data.userId)) {
        const updatedAllVoters = props.allVoters ? [...props.allVoters, data.userId] : [data.userId]
        props.setAllVoters(updatedAllVoters)
      }
    })

    // When another user removes a vote
    socket.on("incoming-remove-vote", data => {
      console.log("someone removed a vote", props.allVoters, data.userId)
      // If that sticky is this current sticky, add the vote
      if (data.stickyId === props.stickyId) {
        const index = props.allVoters.indexOf(data.userId)
        if (index > -1) {
          const updatedAllVoters = [...props.allVoters];
          updatedAllVoters.splice(index, 1);
          props.setAllVoters(updatedAllVoters)
        }
      }
    })

    return () => {
      socket.off("incoming-add-vote");
      socket.off("incoming-remove-vote")
    }
  }, [props.allVoters])

  const addVote = () => {
    console.log("adding a voto")

    // Add vote on this user's DOM
    props.setAllVoters(props.allVoters ? [...props.allVoters, userData.id] : [userData.id])

    // Add vote to database
    API.addVote({userId: userData.id, stickyId: props.stickyId})

    // Show vote on all other users' DOM
    socket.emit("add-vote", {userId: userData.id, stickyId: props.stickyId})
  }

  const removeVote = () => {
    console.log("removing a voto")

    // Remove vote from this user's DOM
    const index = props.allVoters.indexOf(userData.id)
    if (index > -1) {
      const updatedAllVoters = [...props.allVoters];
      updatedAllVoters.splice(index, 1);
      props.setAllVoters(updatedAllVoters);
    }

    // Remove vote from database
    API.removeVote({userId: userData.id, stickyId: props.stickyId})
    
    // Remove vote from all other users' DOM
    socket.emit("remove-vote", {userId: userData.id, stickyId: props.stickyId})
  }

  const handleVoteSticky = e => {
    e.preventDefault();

    props.userAlreadyVoted ? removeVote() : addVote();
  }

  return (
    <button
      className="voteStickyButton"
      onClick={handleVoteSticky}
    >
      v
    </button>
  );
}

export default VoteButton;