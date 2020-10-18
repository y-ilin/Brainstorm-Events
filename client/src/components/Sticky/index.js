import React , { useState, useEffect, useContext } from "react";
import "./style.css";
import ContentEditable from "react-contenteditable";
import Draggable from "react-draggable";
import UserContext from "../../utils/UserContext";
import SocketContext from "../../utils/SocketContext";
import API from "../../utils/API";
import CommentButton from "../CommentButton";
import Comment from "../Comment";
import DeleteButton from "../DeleteButton";
import VoteButton from "../VoteButton";
import VoteCount from "../VoteCount";

export function Sticky(props) {
  const userData = useContext(UserContext);
  const socket = useContext(SocketContext);

  // State to track sticky position
  const [stickyPosition, setStickyPosition] = useState({x: props.x, y: props.y});
  // State to track sticky text content
  const [stickyTextContent, setStickyTextContent] = useState(props.stickyText);
  // State to track all the comments for this sticky
  const [allComments, setAllComments] = useState(props.comments);
  // State to track all votes for this sticky
  const [allVoters, setAllVoters] = useState(props.voters)
  // State to track if this user has already voted for this sticky
  const [userAlreadyVoted, setUserAlreadyVoted] = useState(false)

  useEffect(() => {
    // When another user moves a sticky, listen here to move it on current user's DOM
    socket.on("incoming-sticky-move", data => {
      // If that sticky is this current sticky, move it
      if (data.stickyId === props.stickyId) {
        setStickyPosition({x: data.x, y: data.y})
      }
    })

    return () => {
      socket.off("incoming-sticky-move");
    }
  }, [props.stickyId, socket])

  useEffect(() => {
    // When another user changes a sticky's text, listen here to update the text on current user's DOM
    socket.on("incoming-sticky-text-change", data => {
    // If that sticky is this current sticky, change its text
    if (data.stickyId === props.stickyId) {
      setStickyTextContent(data.stickyTextContent)
    }
    })

    return () => {
      socket.off("incoming-sticky-text-change");
    }
  }, [props.stickyId, socket])


  useEffect(() => {
    // When another user deletes a sticky, listen here to delete it on current user's DOM
    socket.on("incoming-delete-sticky", data => {
        const newAllStickies = props.allStickies.filter(sticky => {
          return sticky.stickyId !== data.stickyId
        })
        props.setAllStickies(newAllStickies)
    })

    return () => {
      socket.off("incoming-delete-sticky");
    }
  }, [props.allStickies, socket])

  // Handle sticky drag
  const handleDrag = (e, data) => {
    setStickyPosition({x: data.x, y: data.y});
  
    // On drag, send new position to server to broadcast to all other users
    socket.emit("sticky-move", {stickyId: props.stickyId, x: data.x, y: data.y})
  }

  // On drop after dragging a sticky, send new position to database
  const handleStopDrag = (e, data) => {
    API.moveSticky({stickyId: props.stickyId, x: data.x, y: data.y})
      .then(data => console.log("sticky moved! ", data))
      .catch(err => console.log(err))
  }

  // After finishing changing a sticky's text
  const handleFinishTextChange = e => {
    // If the text hasn't changed, do nothing
    if (stickyTextContent === e.target.innerHTML) {
      return
    }

    setStickyTextContent(e.target.innerHTML);

    // Send new text to server to broadcast to all other users
    socket.emit("sticky-text-change", {stickyId: props.stickyId, stickyTextContent: e.target.innerHTML});

    // Save new text in database
    API.changeStickyText({stickyId: props.stickyId, stickyTextContent: e.target.innerHTML})
      .then(data => console.log("sticky's new text saved in database! ", data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (allVoters) {
      allVoters.includes(userData.id)
      ? setUserAlreadyVoted(true)
      : setUserAlreadyVoted(false)
    }
  }, [allVoters])

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
        <div className="draggableGroup">
          <ContentEditable
            html={stickyTextContent}
            disabled={false}
            className="sticky"
            onBlur={handleFinishTextChange}
          />
          { props.currentPhase === 2 || props.currentPhase === "finished"
          ? <CommentButton
            stickyId={props.stickyId}
            allComments={allComments}
            setAllComments={setAllComments}
            />
          : null
          }
          <DeleteButton
            stickyId={props.stickyId}
            allStickies={props.allStickies}
            setAllStickies={props.setAllStickies}
          />
          {allComments
          ? allComments.map(comment => {
            return <Comment
              key={comment.commentId}
              commentId={comment.commentId}
              stickyId={comment.stickyId}
              commentText={comment.commentText}
            />
          })
          : null
          }
          { props.currentPhase === 3 || props.currentPhase === "finished"
          ? <VoteButton
            stickyId={props.stickyId}
            allVoters={allVoters}
            setAllVoters={setAllVoters}
            userAlreadyVoted={userAlreadyVoted}
            />
          : null
          }
          { props.currentPhase === 3 || props.currentPhase === "finished"
          ? <VoteCount
            allVoters={allVoters}
            />
          : null
          }
        </div>
      </Draggable>
  );
}

export default Sticky;