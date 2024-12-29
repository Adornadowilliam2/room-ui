import { url } from "./configuration";

export const store = async (body, token) => {
  const reponse = await fetch(`${url}/bookings/`, {
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

export const indexBookings = async (token) => {
  const reponse = await fetch(`${url}/bookings`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};

export const update = async (body, token, id) => {
  const reponse = await fetch(`${url}/bookings/${id}?_method=PATCH`, {
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

export const destroy = async (token, id) => {
  const reponse = await fetch(`${url}/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};
