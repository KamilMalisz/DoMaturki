// /src/auth/auth.js

import { BACK_END_URL } from "../constants/api";

export const register = (user) => {
  return fetch(`${BACK_END_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const login = (user) => {
  return fetch(`${BACK_END_URL}/api/v1/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// przydatne jak user ma edytować swoje konto
// ale sprytny człowiek zmieni w url na innego usera wiec
// moglby edytowac innego uzytkownika, błąd
export const haveUserAccessToHisAction = (userData, user) => {
  console.log("userData._id", userData._id);
  console.log("user._id", user._id);

  if (userData._id === user._id) {
    return true;
  } else {
    return false;
  }
};

export const isAdmin = (userData) => {
  return userData && userData.role && userData.role === "admin";
};
