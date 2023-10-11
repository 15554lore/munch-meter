import React, { useState, useEffect } from "react";
import {
  fetch_with_auth,
  decode_token,
} from "../components/Authentication/auth_func";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import "./LoginSignUp.css";
export default function LoginSignUp({ authFunc, loggedInUserId }) {
  const [isLogin, setIsLogin] = useState(true);

  if (isLogin) {
    return (
      <div className="login">
        <LoginForm authFunc={authFunc} />
        <button className="toSignUpFormBtn" onClick={() => setIsLogin(false)}>
          Don't have an account? <u >Click Here</u>.
        </button>
      </div>
    );
  } else {
    return (
      <div className="signUp">
        <SignUpForm authFunc={authFunc} />
        <button className="toLoginFormBtn" onClick={() => setIsLogin(true)}>
          Already have an account? <u >Click here</u>.
        </button>
      </div>
    );
  }
}
