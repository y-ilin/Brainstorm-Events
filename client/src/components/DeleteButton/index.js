import React, { useEffect, useContext } from "react";
import API from "../../utils/API";
import "./style.css";
import SocketContext from "../../utils/SocketContext";

export function DeleteButton(props) {
  const socket = useContext(SocketContext);

  const handleDeleteSticky = e => {
    e.preventDefault();

    // Delete sticky from this user's DOM
    const newAllStickies = props.allStickies.filter(sticky => {
      return sticky.stickyId !== props.stickyId
    })
    props.setAllStickies(newAllStickies)

    // Delete sticky on all other users' DOM
    socket.emit("delete-sticky", {stickyId: props.stickyId});

    // Delete sticky from database
    API.deleteSticky({stickyId: props.stickyId})
  }

  return (
    <button
      className="deleteStickyButton"
      onClick={handleDeleteSticky}
    >
      x
    </button>
  );
}

export default DeleteButton;