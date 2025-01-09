import { url } from "./configuration";

export const retrieveRooms = async (token) => {
  const reponse = await fetch(`${url}/rooms`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};

export const showRoom = async (token, id) => {
  const reponse = await fetch(`${url}/rooms/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};

export const storeRoom = async (body, token) => {
  const response = await fetch(`${url}/rooms/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body,
  });
  return await response.json();
};

export const updateRoom = async (body, token, id) => {
  const reponse = await fetch(`${url}/rooms/${id}?_method=PATCH`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body,
  });
  return await reponse.json();
};

export const deleteRoom = async (token, id) => {
  const reponse = await fetch(`${url}/rooms/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};
