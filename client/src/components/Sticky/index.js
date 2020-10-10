import React , { useState, useEffect, useContext } from "react";
import "./style.css";
// import io from "socket.io-client";
import Draggable from "react-draggable";
import SocketContext from "../../utils/SocketContext";
import API from "../../utils/API";

export function Sticky(props) {
  const socket = useContext(SocketContext);

  const [stickyPosition, setStickyPosition] = useState({x: props.x, y: props.y});

  useEffect(() => {
    // When another user moves a sticky, listen here to move it on current user's DOM
    socket.on("incoming-sticky-move", data => {
      // console.log(data)
      // If that sticky is this current sticky, move it
      if (data.stickyId === props.stickyId) {
        console.log("same")
        setStickyPosition({x: data.x, y: data.y})
      }
    })
  }, [])

  const handleDrag = (e, data) => {
    // console.log("event: ", e);
    console.log("data: ", data);
    setStickyPosition({x: data.x, y: data.y});
  
    // // On drag, send new position to server to broadcast to all other users
    socket.emit("sticky-move", {stickyId: props.stickyId, x: data.x, y: data.y})

  }

  // On drop after dragging a sticky, send new position to database
  const handleStopDrag = (e, data) => {
    console.log("stickyid: ", props.stickyId)
    console.log("data of stop drag: ", data)
    API.moveSticky({stickyId: props.stickyId, x: data.x, y: data.y})
      .then(data => {
        console.log("sticky moved! ", data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
      <Draggable
        bounds="parent"
        onDrag={handleDrag}
        onStop={handleStopDrag}
        // defaultPosition={{x: stickyPosition.x, y: stickyPosition.y}}
        // defaultPosition={stickyPosition}
        position={stickyPosition}
        // positionOffset={stickyPosition}
      >
        <div className="sticky">{props.stickyText}, {stickyPosition.x}, {stickyPosition.y}</div>
      </Draggable>
  );
}

export default Sticky;