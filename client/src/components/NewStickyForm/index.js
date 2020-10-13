import React, { useState, useContext, useEffect } from "react";
// import io from "socket.io-client";
import API from "../../utils/API";
import "./style.css";
import UserContext from "../../utils/UserContext";
import SocketContext from "../../utils/SocketContext";
import { v4 as uuidv4 } from 'uuid';

export function NewStickyForm(props) {
  const userData = useContext(UserContext);
  const socket = useContext(SocketContext);
  
  // Set up state to track what text is on the new sticky to be submitted
  const [newStickyText, setNewStickyText] = useState("");

  const handleNewStickyTextChange = e => {
    setNewStickyText(e.target.value);
  }

  useEffect(() => {
    // When receiving a broadcast about another user creating a new sticky
    socket.on("incoming-new-sticky", data => {
      // Broadcast.emit not working, do this to exclude sender from adding their new sticky to their DOM
      if (data.client === userData.id) {
        return
      }

      // Create the sticky on this user's DOM as well
      props.setAllStickies([...props.allStickies, {
        stickyId: data.stickyId,
        stickyText: data.stickyText,
        x: data.x,
        y: data.y,
      }]);
    });

    return () => {
      socket.off("incoming-new-sticky")
    };
  }, [props.allStickies, socket]);


  const handleCreateSticky = e => {
    e.preventDefault();
    // If it's an empty sticky, don't create it
    if (newStickyText===""){
      return
    }

    // Create a unique id for this sticky
    const stickyId = uuidv4();

    // Create sticky on user's DOM
    props.setAllStickies([...props.allStickies, {
      stickyId: stickyId,
      stickyText: newStickyText,
      x: 50,
      y: 50,
    }])

    // Send to server to broadcast to create sticky on everyone else's DOM
    socket.emit("send-new-sticky", {stickyId: stickyId, client: userData.id, stickyText: newStickyText, x: 50, y: 50})

    // Create sticky in database
    API.createSticky({stickyId: stickyId, stickyText: newStickyText})
      // .then(data => console.log("sticky created! ", data))
      .catch(err => console.log(err))

    // Clear form field
    setNewStickyText("");
  }


  return (
    <form id="countdownForm">
      <input
        onChange={handleNewStickyTextChange}
        type="text"
        name="newStickyText"
        id="newStickyText"
        placeholder="Your idea!"
      />
      <button onClick={handleCreateSticky}>Stick it on the whiteboard!</button>
    </form>
  );
}

export default NewStickyForm;