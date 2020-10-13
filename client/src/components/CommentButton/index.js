import React, { useState } from "react";
import API from "../../utils/API";
import "./style.css";
import { v4 as uuidv4 } from 'uuid';

export function CommentButton(props) {
  const handleCreateComment = e => {
    e.preventDefault()

    // Create a unique id for this sticky
    const commentId = uuidv4();

    // Create empty comment on user's DOM
    props.setAllComments([...props.allComments, {
      stickyId: props.stickyId,
      commentText: "",
    }])

    // Send to server to broadcast to create comment on everyone else's DOM

    // Create comment in database, link it to the current sticky
    API.createComment({commentId: commentId, stickyId: props.stickyId})
      .then(data => console.log("empty comment created!", data))
      .catch(err => console.log(err))
  }

  return (
    <button
      className="addCommentButton"
      onClick={handleCreateComment}
    >
      +
    </button>
  );
}

export default CommentButton;