import React, { useEffect, useContext } from "react";
import API from "../../utils/API";
import "./style.css";
import UserContext from "../../utils/UserContext";
import SocketContext from "../../utils/SocketContext";

export function VoteButton({stickyId, allVoters, setAllVoters, userAlreadyVoted}) {
  const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    // When another user adds a vote
    socket.on("incoming-add-vote", data => {
      console.log("someomne added a vote", allVoters, data.userId)
      // If that sticky is this current sticky, add the vote
      if (data.stickyId === stickyId && !allVoters.includes(data.userId)) {
        const updatedAllVoters = allVoters ? [...allVoters, data.userId] : [data.userId]
        setAllVoters(updatedAllVoters)
      }
    })

    // When another user removes a vote
    socket.on("incoming-remove-vote", data => {
      console.log("someone removed a vote", allVoters, data.userId)
      // If that sticky is this current sticky, add the vote
      if (data.stickyId === stickyId) {
        const index = allVoters.indexOf(data.userId)
        if (index > -1) {
          const updatedAllVoters = [...allVoters];
          updatedAllVoters.splice(index, 1);
          setAllVoters(updatedAllVoters)
        }
      }
    })

    return () => {
      socket.off("incoming-add-vote");
      socket.off("incoming-remove-vote")
    }
  }, [allVoters, stickyId, socket])

  const addVote = () => {
    console.log("adding a voto")

    // Add vote on this user's DOM
    setAllVoters(allVoters ? [...allVoters, userData.id] : [userData.id])

    // Add vote to database
    API.addVote({userId: userData.id, stickyId: stickyId})

    // Show vote on all other users' DOM
    socket.emit("add-vote", {userId: userData.id, stickyId: stickyId})
  }

  const removeVote = () => {
    console.log("removing a voto")

    // Remove vote from this user's DOM
    const index = allVoters.indexOf(userData.id)
    if (index > -1) {
      const updatedAllVoters = [...allVoters];
      updatedAllVoters.splice(index, 1);
      setAllVoters(updatedAllVoters);
    }

    // Remove vote from database
    API.removeVote({userId: userData.id, stickyId: stickyId})
    
    // Remove vote from all other users' DOM
    socket.emit("remove-vote", {userId: userData.id, stickyId: stickyId})
  }

  const handleVoteSticky = e => {
    e.preventDefault();

    userAlreadyVoted ? removeVote() : addVote();
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