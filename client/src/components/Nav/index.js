import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import "./style.css";
import UserContext from "../../utils/UserContext";
import API from "../../utils/API";


export function Nav(props) {
  const userData = useContext(UserContext);

  const getInitialForName = (name) => {
    const index = name.search(/[A-Za-z0-9]/g);
    return index === -1 ? "" : name[index];
  };

  const initials = (getInitialForName(userData.firstName) + getInitialForName(userData.lastName)).toUpperCase()

  const handleLogout = e => {
    e.preventDefault();
    API.logout({})
      .then(() => {
        props.setLoggedIn(false)
      })
  }

  return (
    <div id="nav">
      <div id="navDiv">
        <p className="initials">{initials}</p>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Nav;