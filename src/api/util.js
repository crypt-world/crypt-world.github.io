export function setUserData(data) {
  return localStorage.setItem("userData", JSON.stringify(data));
}

export function getUserData() {
  return JSON.parse(localStorage.getItem("userData"));
}

export function deleteUserData() {
  return localStorage.removeItem("userData");
}

export function parseQuery(querystring){
  if(querystring == ""){
    return {};
  }else {
  return querystring.split('&').reduce((acc, curr) => {
            const [key, value] = curr.split('=');
            acc[key] = value;
            return acc;
        }, {})
  }
}

