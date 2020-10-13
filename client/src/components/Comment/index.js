import React, { useState, useContext } from "react";
import "./style.css";
import ContentEditable from "react-contenteditable";
import SocketContext from "../../utils/SocketContext";
import API from "../../utils/API";

export function Comment(props) {
  const socket = useContext(SocketContext);

  // State to track the comment text
  const [commentTextContent, setCommentTextContent] = useState(props.commentText);

  // After finishing changing a sticky's text
  const handleFinishCommentChange = e => {
    // If the text hasn't changed, do nothing
    if (commentTextContent === e.target.innerHTML) {
      return
    }

    setCommentTextContent(e.target.innerHTML);

    // Send new text to server to broadcast to all other users
    socket.emit("sticky-text-change", {stickyId: props.stickyId, stickyTextContent: e.target.innerHTML});

    // Save new text in database
    API.changeCommentText({stickyId: props.stickyId, commentTextContent: e.target.innerHTML})
      .then(data => console.log("comment's new text saved in database! ", data))
      .catch(err => console.log(err))
  }

  return (
    <ContentEditable
      html={commentTextContent}
      disabled={false}
      className="comment"
      onBlur={handleFinishCommentChange}
    />
  );
}

export default Comment;