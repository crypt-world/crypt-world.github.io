import { render, page } from "../lib.js";
import { getUserData } from "../api/util.js";
import { logout } from "../api/data.js";

const root = document.getElementById("main-content");
document.querySelector("#logout-btn").addEventListener("click", onLogout);

export function contextDecorator(ctx, next) {
  ctx.render = (content) => render(content, root);
  ctx.updateUserNav = updateUserNav;

  next();
}

export function updateUserNav() {
  const userData = getUserData();
  if (userData) {
    Array.from(document.querySelectorAll("li#user")).forEach(
      (e) => (e.style.display = "block")
    );
    document.getElementById('username-greeting').textContent = `welcome, ${userData.username}`
    Array.from(document.querySelectorAll("li#guest")).forEach(
      (e) => (e.style.display = "none")
    );

  } else {
    Array.from(document.querySelectorAll("li#user")).forEach(
      (e) => (e.style.display = "none")
    );
    Array.from(document.querySelectorAll("li#guest")).forEach(
      (e) => (e.style.display = "block")
    );
  }
}

async function onLogout() {
  const response = await logout();
  updateUserNav();
  page.redirect("/");
}
