import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/API";
import "./style.css";
import UserContext from "../../utils/UserContext";
import SocketContext from "../../utils/SocketContext";
import { v4 as uuidv4 } from 'uuid';

export function CommentButton(props) {
  const userData = useContext(UserContext);
  const socket = useContext(SocketContext);
  
  useEffect(() => {
    // When receiving a broadcast about another user creating a new comment
    socket.on("incoming-new-comment", data => {
      // Broadcast.emit not working, do this to exclude sender from adding their new comment to their DOM
      // if (data.client === userData.id) {
      //   console.log("that's from u dummy")
      //   return
      // }
      console.log("adding new comment from another user")

      // If the incoming new comment relates to this sticky, then
      // create the comment on this sticky on this user's DOM as well
      if (data.stickyId === props.stickyId) {
        props.setAllComments([...props.allComments, {
          commentId: data.commentId,
          stickyId: data.stickyId,
          commentText: "",
        }])
      }
      console.log(props.allComments);
    });

    return () => {
      socket.off("incoming-new-sticky")
    };
  }, [props.allComments, socket]);


  const handleCreateComment = e => {
    e.preventDefault()

    // Create a unique id for this sticky
    const commentId = uuidv4();

    // Create empty comment on user's DOM
    props.setAllComments([...props.allComments, {
      commentId: commentId,
      stickyId: props.stickyId,
      commentText: "",
    }])

    // Send to server to broadcast to create comment on everyone else's DOM
    socket.emit("send-new-comment", {commentId: commentId, stickyId: props.stickyId, client: userData.id})

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