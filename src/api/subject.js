import { url } from "./configuration";

export const getSubjects = async (token) => {
  const reponse = await fetch(`${url}/subjects`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};

export const storeSubject = async (body, token) => {
  const reponse = await fetch(`${url}/subjects/`, {
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
