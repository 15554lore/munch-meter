import React, { useState } from "react";
import { eye, eyeSlash } from "../Icons";
import { validEmail, validPassword } from "../Constants";
import "./SignUpForm.css";
import { fetch_with_auth, saveJWT } from "./Authentication/auth_func";
export default function SignUpForm({ authFunc }) {
  // Constants for username, email, password
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Constants for checking validity of email and password

  const [emailInvalidErr, setEmailInvalidErr] = useState(false);
  const [passwordInvalidErr, setPasswordInvalidErr] = useState(false);
  const [usernameEmptyErr, setUsernameEmptyErr] = useState(false);
  const [usernameExistErr, setUsernameExistErr] = useState(false);
  const [emailRegisteredErr, setEmailRegisteredErr] = useState(false);

  // boolean for showing password
  const [passwordShown, setPasswordShown] = useState(false);

  // Setter for username
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  // Setter for email
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // Setter for password
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Compares email against email regex
  const checkEmail = async (e) => {
    fetch("/get_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if ("email" in data) {
          setEmailRegisteredErr(true);
          setEmailInvalidErr(false);
        }
        return;
      });
    if (!validEmail.test(email)) {
      setEmailInvalidErr(true);
      setEmailRegisteredErr(false);
    } else {
      setEmailInvalidErr(false);
      setEmailRegisteredErr(false);
    }
  };

  // Compares password against password regex
  const checkPassword = (e) => {
    if (!validPassword.test(password)) {
      setPasswordInvalidErr(true);
    } else {
      setPasswordInvalidErr(false);
    }
  };

  // Checks if username field is empty

  const checkUsername = (e) => {
    fetch_with_auth("/get_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if ("username" in data) {
          setUsernameExistErr(true);
          setUsernameEmptyErr(false);
        }
        return;
      });
    if (e.target.value == 0) {
      setUsernameEmptyErr(true);
      setUsernameExistErr(false);
    } else {
      setUsernameEmptyErr(false);
      setUsernameExistErr(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    setPasswordShown(!passwordShown);
  };

  // checks whether all the errors are false and submits

  const handleSubmit = async (e) => {
    if (
      !passwordInvalidErr &&
      !emailInvalidErr &&
      !usernameEmptyErr &&
      !usernameExistErr &&
      !emailRegisteredErr
    ) {
      const login_payload = {
        email: email,
        password: password,
        username: username,
      };
      const res = await fetch("/add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login_payload),
      });
      const resObj = await res.json();
      if (resObj.success === true) {
        const tokenData = await fetch("/auth_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(login_payload),
        });
        const tokenObject = await tokenData.json();
        const token = tokenObject.authentication;

        saveJWT(token);
        authFunc(true);
        //.then((response) => response.json().then(data => ({statusg: response.status, body: data})))
      } else {
        alert("Submit Form invalid");
      }
    } else {
      alert("Submit Form invalid");
    }
  };

  return (
    <div className="signUpDiv">
      <form
        className="signUpForm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        noValidate
      >
        <h1>Sign Up</h1>
        <br />
        <input
          type="text"
          className="usernameInput"
          placeholder="Username"
          value={username}
          onChange={handleUsername}
          onBlur={checkUsername}
          required
        />
        {usernameEmptyErr && (
          <label htmlFor="usernameInput" className="usernameEmptyLabel">
            Username field empty
          </label>
        )}
        {usernameExistErr && (
          <label htmlFor="usernameInput" className="usernameEmptyLabel">
            Username already in use
          </label>
        )}
        <br />
        <input
          type="text"
          className="emailInput"
          value={email}
          placeholder="Email"
          onChange={handleEmail}
          onBlur={checkEmail}
          required
        />
        {/* Renders label if email is invalid*/}
        {/* Can change styles*/}
        {emailInvalidErr && (
          <label htmlFor="emailInput" className="emailInvalidLabel">
            Email invalid
          </label>
        )}
        {emailRegisteredErr && (
          <label
            htmlFor="emailInput"
            className="emailRegisteredLabel"
            style={{ padding: 40, color: "#a20" }}
          >
            Email is already in use
          </label>
        )}
        <br />
        <div className="passwordWrapper">
          <input
            type={passwordShown ? "text" : "password"}
            className="passwordInput"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            onBlur={checkPassword}
            required
          />
          <i onClick={togglePasswordVisibility} className="eyeIcon">
            {passwordShown ? eye : eyeSlash}
          </i>

          {/* Renders label if password is invalid*/}
          {/* Can change styles*/}
          {passwordInvalidErr && (
            <label htmlFor="passwordInput" className="passwordInvalidLabel">
              Password invalid
            </label>
          )}
          <br />
        </div>
        <button onClick={handleSubmit} className="submitBtn" type="submit">
          Submit
        </button>
      </form>

      <p>
        Requirements:
        <br></br>
        Your username must:
        <ul>
          <li>Be between 6 and 16 characters long</li>
          <li>Be unique</li>
        </ul>
      </p>
      <p>
        Your password must:
        <ul>
          <li>Be at least 6 characters long</li>
          <li>Contain a mixture of letters and numbers</li>
        </ul>
      </p>
      <p>
        Your email must:
        <ul>
          <li>Be unique and valid</li>
        </ul>
      </p>
    </div>
  );
}
