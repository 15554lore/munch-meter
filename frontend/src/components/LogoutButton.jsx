import React from "react";
import { useState } from "react";
import { fetch_with_auth, removeJWT } from "./Authentication/auth_func";

export default function LogoutButton({ authFunc, userId }) {
  const [username, setUsername] = useState("");

  fetch_with_auth("/get_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      setUsername(data["username"]);
    });

  const handleClick = () => {
    removeJWT();
    authFunc(false);
  };

  return (
    <span>
      Welcome {username}{" "}
      <button onClick={handleClick} className="btn btn-danger">
        Logout
      </button>
    </span>
  );
}
