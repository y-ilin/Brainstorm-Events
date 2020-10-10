import React , { useState, useEffect, useContext } from "react";
import "./style.css";
import ContentEditable from "react-contenteditable";
import Draggable from "react-draggable";
import SocketContext from "../../utils/SocketContext";
import API from "../../utils/API";

export function Sticky(props) {
  const socket = useContext(SocketContext);

  // State to track sticky position
  const [stickyPosition, setStickyPosition] = useState({x: props.x, y: props.y});
  // State to track sticky text content
  const [stickyTextContent, setStickyTextContent] = useState(props.stickyText);

  useEffect(() => {
    // When another user moves a sticky, listen here to move it on current user's DOM
    socket.on("incoming-sticky-move", data => {
      // If that sticky is this current sticky, move it
      if (data.stickyId === props.stickyId) {
        setStickyPosition({x: data.x, y: data.y})
      }
    })

    // When another user changes a sticky's text, listen here to update the text on current user's DOM
    socket.on("incoming-sticky-text-change", data => {
    // If that sticky is this current sticky, move it
    if (data.stickyId === props.stickyId) {
      setStickyTextContent(data.stickyTextContent)
    }

    })
  }, [])

  // Handle sticky drag
  const handleDrag = (e, data) => {
    setStickyPosition({x: data.x, y: data.y});
  
    // On drag, send new position to server to broadcast to all other users
    socket.emit("sticky-move", {stickyId: props.stickyId, x: data.x, y: data.y})

  }

  // On drop after dragging a sticky, send new position to database
  const handleStopDrag = (e, data) => {
    API.moveSticky({stickyId: props.stickyId, x: data.x, y: data.y})
      .then(data => {
        console.log("sticky moved! ", data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  // After finishing changing a sticky's text
  const handleFinishTextChange = e => {
    // If the text hasn't changed, do nothing
    if (stickyTextContent === e.target.innerHTML) {
      return
    }

    setStickyTextContent(e.target.innerHTML);

    // // Send new text to server to broadcast to all other users
    socket.emit("sticky-text-change", {stickyId: props.stickyId, stickyTextContent: e.target.innerHTML});

    // // Save new text in database
    API.changeStickyText({stickyId: props.stickyId, stickyTextContent: e.target.innerHTML})
      .then(data => {
        console.log("sticky's new text saved in database! ", data)
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
        <ContentEditable
          html={stickyTextContent}
          disabled={false}
          className="sticky"
          // onChange={handleStickyTextChange}
          onBlur={handleFinishTextChange}
        />
      </Draggable>
  );
}

export default Sticky;