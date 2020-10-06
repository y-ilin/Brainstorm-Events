import React, { useState } from "react";
// import "./style.css";
import API from "../utils/API";

function Signup() {
  // Keep track of form values as they change
  const [formObject, setFormObject] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  // Handle form values as they change
  function handleInputChange(e) {
    // add code to control the components here
    setFormObject({
      ...formObject,
      [e.target.name]: e.target.value,
    })
  }

  // Handle clicking login button
  const handleLoginSubmit = e => {
    e.preventDefault();


    // If either the email or password isn't filled in, do nothing
    // if (!formObject.email || !formObject.password) {
    //   return;
    // }

    // If we have an email and password we run the loginUser function and clear the form
    signUpUser(formObject);

    // Clear form
    setFormObject({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    })
  };

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function signUpUser(formObject) {
    API.signUp(formObject)
    .then(() => {
      window.location.replace("/");
    })
    .catch(err => {
      console.log(err);
    });
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <h2>Sign Up</h2>
            <form className="signup">
            <div className="form-group">
                <input
                  value={formObject.firstName}
                  onChange={handleInputChange}
                  name="firstName"
                  type="text"
                  className="form-control"
                  id="firstname-input"
                  placeholder="FIRST NAME"
                />
              </div>
              <div className="form-group">
                <input
                  value={formObject.lastName}
                  onChange={handleInputChange}
                  name="lastName"
                  type="text"
                  className="form-control"
                  id="lastname-input"
                  placeholder="LAST NAME"
                />
              </div>
              <div className="form-group">
                <input
                  value={formObject.email}
                  onChange={handleInputChange}
                  name="email"
                  type="email"
                  className="form-control"
                  id="email-input"
                  placeholder="EMAIL"
                />
              </div>
              <div className="form-group">
                <input
                  value={formObject.password}
                  onChange={handleInputChange}
                  name="password"
                  type="password"
                  className="form-control formMargin"
                  id="password-input"
                  placeholder="PASSWORD"
                />
              </div>
              <div
                style={{display: "none"}}
                id="alert"
                className="alert alert-danger"
                role="alert"
              >
                <span
                  className="glyphicon glyphicon-exclamation-sign"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Error:</span> <span className="msg"></span>
              </div>
              <button
                onClick={handleLoginSubmit}
                id="form-button"
                type="submit"
                className="btn btn-default signup-button"
              >
                Sign Up
              </button>
            </form>
            <br />
            <p>Or log in <a href="/login">here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
