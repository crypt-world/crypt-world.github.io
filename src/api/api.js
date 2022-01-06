import { deleteUserData, getUserData, setUserData } from "./util.js";

const host = "https://parseapi.back4app.com";

async function request(url, options) {
  const response = await fetch(host + url, options);
  try {
    if (response.ok == false) {
      const err = await response.json();
      throw new Error(err.error);
    } else {
      return response.json();
    }
  } catch (error) {
    // alert(error.message);
    throw error;
  }
}

function createOptions(method = "get", data) {
  const options = {
    method,
    headers: {
      "X-Parse-Application-Id": "QN3MjoNxuHSgg2Ik3LNaHpLSK2N9vh9MB67AokS1",
      "X-Parse-REST-API-Key": "tXVYb9FDYraWnyuKPuS25Y1uKSR9vOePVvSALEuP",
    },
  };

  if (data != undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const userData = getUserData();
  if (userData) {
    options.headers["X-Parse-Session-Token"] = userData.token;
  }

  return options;
}

export async function get(url) {
  return request(url, createOptions());
}

export async function post(url, data) {
  return request(url, createOptions("post", data));
}

export async function put(url, data) {
  return request(url, createOptions("put", data));
}

export async function del(url) {
  return request(url, createOptions("delete"));
}

export async function login(username, password) {
  const result = await post("/login", { username, password });
  const userData = {
    username: result.username,
    id: result.objectId,
    token: result.sessionToken,
  };

  setUserData(userData);
}

export async function register(username, email, password) {
  const result = await post("/users", { username, email, password });
  const userData = {
    username,
    email,
    id: result.objectId,
    token: result.sessionToken,
  };

  setUserData(userData);
}

export async function logout() {
  await post("/logout");
  deleteUserData();
}
