import React, { useState, useEffect } from "react";
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import UserContext from "./utils/UserContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Whiteboard from "./pages/Whiteboard";
import Logout from "./pages/Logout";
import NoMatch from "./pages/NoMatch";
import axios from "axios";

function App() {
  // Tracking if the user is logged in, and the user data
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: ""
  })

  useEffect(() => {
    axios.get("/api/user_data")
    .then(result => {
      if (result.data.email) {
        setLoggedIn(true);
        setUserData({
          id: result.data.id,
          email: result.data.email,
          firstName: result.data.firstName,
          lastName: result.data.lastName
        })
      }
    })
  }, [loggedIn]);


  return (
    <BrowserRouter>
      <div>
        <UserContext.Provider value={userData}>
          {/* <Nav /> */}
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/login">
              {loggedIn ?
                <Redirect to="/dashboard" />
                :
                <Login setLoggedIn={setLoggedIn}/>
              }
            </Route>
            <Route exact path="/signup">
                <Signup setLoggedIn={setLoggedIn}/>
            </Route>
            <Route path="/dashboard">
              {loggedIn ? 
                <Dashboard />
                :  
                <Redirect to="/login"></Redirect> 
              }
            </Route>
            <Route path="/whiteboard">
              {loggedIn ? 
                <Whiteboard />
                :  
                <Redirect to="/login"></Redirect> 
              }
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>

            <Route exact path="/logout">
              {loggedIn ?
                <Logout setLoggedIn={setLoggedIn}/> 
                :
                <Redirect to="/login" />
              }
            </Route>
          </Switch>
        </UserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
