import { url } from "./configuration";

export const getUsers = async (token) => {
  const reponse = await fetch(`${url}/users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await reponse.json();
};
