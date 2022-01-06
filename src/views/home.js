import { html } from "../lib.js";

const homePageTemplate = () => html` <div class="start-page-container">
  <h1 class="start-page-main-quote">
    Don't know anything about crypto currencies?
  </h1>
  <h2 class="start-page-secondary-quote">
    Stop wasting your time and get started. <a href="/login">Sign in</a>
  </h2>
</div>`;

export function homePage(ctx) {
  ctx.render(homePageTemplate());
}
