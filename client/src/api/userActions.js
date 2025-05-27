import { BACK_END_URL } from "../constants/api";

export const updateUserAction = async (userId, userData) => {
  return fetch(`${BACK_END_URL}/api/v1/users/update/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
      // "Content-Type": "application/json",
    },
    body: userData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
