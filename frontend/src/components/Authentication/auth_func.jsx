import React, { useState } from "react";

// All the authentication functions are saved in this file

// saves JWT in local storage
export const saveJWT = (token) => {
  window.localStorage.setItem("jwt_token", token);
};

// gets JWT from local storage
export const getJWT = () => {
  return localStorage.getItem("jwt_token");
};

// checks if JWT is in local storage
export const hasJWT = () => {
  return localStorage.getItem("jwt_token") ? true : false;
};

// deletes JWT from local storage
export const removeJWT = () => {
  localStorage.removeItem("jwt_token");
};

export const JWT_valid = async () => {
  const response = await fetch_with_auth("/check_auth");
  const [status, data] = await [response.status, response.json()];

  // if (status == 401) {
  //     removeJWT();
  // }
  return status == 200 ? true : false;
  // return fetch_with_auth('/check_auth')
  // .then((response) => {
  //     if (response.ok) {
  //         return true
  //     } else {
  //         return false
  //     }
  // })
  // .then((bool) => {
  //     console.log(bool)
  //     return bool}
  //     )
};
// used to update headers for new fetch with auth function
const updateOptions = (options) => {
  const update = { ...options };
  if (hasJWT()) {
    update.headers = {
      ...update.headers,
      Authorization: getJWT(),
    };
  }

  return update;
};

// if auth is needed in the server-side use this function instead of fetch
export const fetch_with_auth = (url, options) => {
  return fetch(url, updateOptions(options));
};

export const decode_token = async () => {
  const response = await fetch_with_auth("/decode_token");
  const data = await response.json();
  return data;
};
