import { BACK_END_URL } from "../../constants/api";

export const createCityAction = async (cityData) => {
  return fetch(`${BACK_END_URL}/api/v1/cities/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cityData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getCity = async (id) => {
  return fetch(`${BACK_END_URL}/api/v1/cities/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const updateCityAction = async (cityData) => {
  return fetch(`${BACK_END_URL}/api/v1/cities/update/${cityData._id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cityData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
