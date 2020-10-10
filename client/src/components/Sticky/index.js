import React from "react";
import Draggable from "react-draggable";
import "./style.css";

export function Sticky(props) {
  // const [stickyPosition, setStickyPosition] = useState({x: 0, y: 0});

  const handleDrag = (e, data) => {
    console.log("event: ", e);
    console.log("data: ", data);
    // setStickyPosition({x: data.x, y: data.y});
  }

  return (
      <Draggable
        bounds="parent"
        onDrag={handleDrag}
        defaultPosition={{x: props.x, y: props.y}}
      >
        <div className="sticky">{props.stickyText}</div>
      </Draggable>
  );
}

export default Sticky;