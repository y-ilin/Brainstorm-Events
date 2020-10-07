import React, { useState } from "react";
// import "./style.css";
import API from "../utils/API";

function Login() {
  // Keep track of form values as they change
  const [formObject, setFormObject] = useState({
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
    if (!formObject.email || !formObject.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(formObject.email, formObject.password);

    // Clear form
    setFormObject({
      email: "",
      password: "",
    })
  };

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    API.login({
      email: email,
      password: password
    })
      .then(() => {
        // res.redirect("/index.html");
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
            <h2>Login</h2>
            <form className="login">
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
              <button
                onClick={handleLoginSubmit}
                id="form-button"
                type="submit"
                className="btn btn-default login-button"
              >
                Login
              </button>
            </form>
            <br />
            <p>Or sign up <a href="/signup">here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
