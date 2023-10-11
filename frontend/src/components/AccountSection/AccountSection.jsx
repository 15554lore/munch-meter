import { useEffect, useState } from "react";
import EditButton from "./EditButton";
import EditableField from "./EditableField";
import { fetchImage } from "../fetchImage";
import { fetch_with_auth, getJWT } from "../Authentication/auth_func";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FoodImage from "./FoodImage";

export default function AccountSection({ userId }) {
  const defaultUserData = {
    lowestRanking: "none",
    highestRanking: "none",
    username: "No username found",
    email: "No email found",
  };
  const [editing, setEditing] = useState({
    lowestRanking: false,
    highestRanking: false,
    username: false,
    email: false,
  });

  const [userData, setUserData] = useState(defaultUserData);
  const [userImages, setuserImages] = useState({});
  //Effect hook fetches user data everytime userId changes (every time user logs into another account)
  useEffect(() => {
    console.log("Token");
    console.log(getJWT());
    async function fetchUserData() {
      try {
        //Fetch raw user data from route
        const res = await fetch_with_auth("/get_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId, AccountSection: true }),
        });

        //Convert to data to json
        const resToJson = await res.json();
        setUserData(resToJson);
      } catch {
        console.log("Couldnt fetch user data");
        setUserData(defaultUserData);
      }
    }
    fetchUserData();
  }, []); // userId is a dependency since data needs to be rerendered if user switches
  useEffect(() => {
    async function fetchUserImages() {
      const tempUrls = {};
      if (
        !(
          userData.highestRanking === "none" ||
          userData.lowestRanking === "none"
        )
      ) {
        tempUrls[userData.highestRanking.image_url] = await fetchImage(
          userData.highestRanking.image_url
        );
        tempUrls[userData.lowestRanking.image_url] = await fetchImage(
          userData.lowestRanking.image_url
        );
        setuserImages(tempUrls);
      }
    }
    fetchUserImages();
  }, [userData.highestRanking, userData.lowestRanking]);

  const handleFormSubmit = async (element, event) => {
    event.preventDefault();
    const inputValue = event.target.elements["inputBox"].value;
    setEditing({ ...editing, [element]: false });

    try {
      const res = await fetch_with_auth("/get_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [element]: inputValue }),
      });

      const userJson = await res.json();
      console.log(userJson);
      if ("error" in userJson) {
        await fetch_with_auth("/update_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            newData: { key: element, value: inputValue },
          }),
        });
        setUserData({ ...userData, [element]: inputValue });
      } else if ("username" in userJson || "email" in userJson) {
        alert(`${element} already exists!`);
        return;
      }
    } catch {
      console.log("Could not update user data");
    }
  };
  console.log(userData);

  return (
    <Container>
      <Row className="mx-auto text-center">
        <form onSubmit={(event) => handleFormSubmit("username", event)}>
          <EditButton
            element="username"
            editing={editing}
            setEditing={setEditing}
          />
          <EditableField
            className="display-1"
            element={"username"}
            editing={editing}
            userData={userData}
            displayName=""
          />
        </form>
      </Row>
      <Row className="mx-auto text-center">
        <form onSubmit={(event) => handleFormSubmit("email", event)}>
          <EditButton
            element="email"
            editing={editing}
            setEditing={setEditing}
          />
          <EditableField
            className="emailField"
            element="email"
            editing={editing}
            userData={userData}
            displayName=""
          />
        </form>
      </Row>
      <Row className="mt-5">
        <Col>
          <h6 className="highestRankingField text-center m-3">
            Highest ranking:
          </h6>
          <FoodImage entry={userData.highestRanking} userImages={userImages} />
        </Col>
        <Col>
          <h6 className="lowestRankingField text-center m-3">
            Lowest ranking:
          </h6>
          <FoodImage entry={userData.lowestRanking} userImages={userImages} />
        </Col>
      </Row>
    </Container>
  );
}
