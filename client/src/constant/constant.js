export const backLink = "http://localhost:8080";
export const frontLink = window.location.origin;
export const adminRoute = "/";
export const ws = new WebSocket("ws://localhost:8081");

export const getCurrentSession = () => {
  let user = null;
  try {
    user =
      localStorage.getItem("current_session") != null
        ? JSON.parse(localStorage.getItem("current_session"))
        : null;
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js  : getCurrentSession -> error", error);
    user = null;
  }
  return user;
};

export const setCurrentSession = (user) => {
  try {
    if (user) {
      localStorage.setItem("current_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("current_session");
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setCurrentSession -> error", error);
  }
};

export const getCurrentUser = () => {
  let user = null;
  try {
    user =
      localStorage.getItem("current_user") != null
        ? JSON.parse(localStorage.getItem("current_user"))
        : null;
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js  : getCurrentUser -> error", error);
    user = null;
  }
  return user;
};

export const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem("current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("current_user");
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setCurrentUser -> error", error);
  }
};
