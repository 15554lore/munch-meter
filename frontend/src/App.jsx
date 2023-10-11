import React, { useEffect, useState } from "react";
import AccountSection from "./components/AccountSection/AccountSection";
import ImageForm from "./components/ImageForm";
import ImagePair from "./components/ImagePair";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import LoginSignUp from "./pages/LoginSignUp";
import Leaderboard from "./components/Leaderboard";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import logo from ".//munch.png";
import Image from "react-bootstrap/Image";
import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  hasJWT,
  JWT_valid,
  removeJWT,
  decode_token,
} from "./components/Authentication/auth_func";
import LogoutButton from "./components/LogoutButton";
// import Ranking from './components/Ranking';

function App() {
  // setIsAuth is passed in LoginForm and LogoutButton to send authed information to app.js
  const [isAuth, setIsAuth] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  // checks if current user is authenticated

  useEffect(() => {
    async function check_authed() {
      if (hasJWT()) {
        let response = await JWT_valid();
        if (response) {
          const id_response = await decode_token();
          console.log(id_response);
          setLoggedInUserId(id_response.public_id);
        }
        setIsAuth(response);
      } else {
        setLoggedInUserId(null);
      }
    }
    check_authed();
  }, [isAuth]);

  return (
    <>
      <div className="App">
        <Container className="me-0 ms-0" fluid>
          <Row>
            <Col></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <Image src={logo} height="180" width="330" id="logo" rounded />
            </Col>
            <Col className="text-end">
              {isAuth ? (
                <LogoutButton authFunc={setIsAuth} userId={loggedInUserId} />
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Container>
        {isAuth ? (
          <Tabs
            defaultActiveKey="Account"
            id="tabs"
            className="mb-3"
            justify
            variant="tabs"
            unmountOnExit="true"
          >
            <Tab eventKey="Account" title="Account">
              <AccountSection userId={loggedInUserId} />
            </Tab>
            <Tab eventKey="Voting" title="Voting">
              <ImagePair />
            </Tab>
            <Tab eventKey="Leaderboard" title="Leaderboard">
              <Leaderboard />
              <footer>
                <a href="https://lordicon.com/">
                  Animated icons by Lordicon.com
                </a>
              </footer>
            </Tab>
            <Tab eventKey="Image Upload" title="Image Upload">
              <ImageForm userId={loggedInUserId} />
            </Tab>
          </Tabs>
        ) : (
          <Tabs
            defaultActiveKey="Login"
            id="tabs"
            className="mb-3"
            justify
            variant="tabs"
            unmountOnExit="true"
          >
            <Tab eventKey="Login" title="Login" variant="secondary">
              <LoginSignUp
                authFunc={setIsAuth}
                loggedInUserId={loggedInUserId}
              />
            </Tab>
          </Tabs>
        )}
      </div>
    </>
  );
}

export default App;
