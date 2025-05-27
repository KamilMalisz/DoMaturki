// /src/api/listingActions.js

import { BACK_END_URL } from "../constants/api";

export const addListingAction = async (listingData) => {
  return fetch(`${BACK_END_URL}/api/v1/listings`, {
    method: "POST",
    credentials: "include", // bez niego nie przekaże ciasteczek na serwer
    // i veryfiUserToken nie zadziała, nie bedzie miał tokena
    // nie sprawdzi czy ma dostep do tej akcji na serwerze
    headers: {
      Accept: "application/json",
    },
    body: listingData, // JSON.stringify(listingData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// aktualizacja listingu, id w listingData
export const updateListingAction = async (listingData) => {
  return fetch(`${BACK_END_URL}/api/v1/listings/`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    body: listingData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getListing = async (id) => {
  return fetch(`${BACK_END_URL}/api/v1/listings/${id}`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const finishListingAction = async (id) => {
  return fetch(`${BACK_END_URL}/api/v1/listings/finish`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// pobranie ostatnio dodanych listingów z serwera
export const getLatestListings = async (limit = 5, type = "sprzedaż") => {
  try {
    const response = await fetch(
      `${BACK_END_URL}/api/v1/listings/latest?limit=${limit}&type=${encodeURIComponent(
        type
      )}`
    );
    if (!response.ok) {
      throw new Error("Błąd podczas pobierania najnowszych listingów");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
