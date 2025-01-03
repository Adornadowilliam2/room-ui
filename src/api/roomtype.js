import { url } from "./configuration";

export const retrieveRoomTypes = async (token) => {
  const reponse = await fetch(`${url}/roomTypes`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};

export const storeRoomType = async (body, token) => {
  const reponse = await fetch(`${url}/roomTypes/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await reponse.json();
};


export const updateRoomType = async (body, token, id) => {
  const reponse = await fetch(`${url}/roomTypes/${id}?_method=PATCH`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await reponse.json();
};

export const destroyRoomType = async (token, id) => {
  const reponse = await fetch(`${url}/roomTypes/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};