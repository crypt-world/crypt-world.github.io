import { html, classMap } from "../lib.js";
import { login } from "../api/data.js";
import { getUserData } from "../api/util.js";


const loginPageTemplate = (onLogin, errMsg, missingFields) => html` <div
  class="login-fieldset-wrapper"
>
  <fieldset class="login-fieldset">
    <legend>Sign in</legend>
    <form @submit=${onLogin} class="register-form">
    ${errMsg.length > 0 ? html`<span class="create-form-error-message-span">${errMsg}</span>`
                          : null}
      <label class="username-label login-form-label">
        Enter your username * :
        <input
          class="login-form-input ${classMap({'error': missingFields.username})}"
          type="text"
          name="username"
          id="username-input"
        />
      </label>
      <label class="password-label login-form-label">
        Enter your password * :
        <input
          class="login-form-input ${classMap({'error': missingFields.password})}"
          type="password"
          name="password"
          id="password-input"
        />
      </label>
      <button class="submit-btn">Sign in</button>
      <span class="do-not-have-account"
        >Don't have an account?<a href="/register">Sign up</a>
      </span>
    </form>
  </fieldset>
</div>`;

export function loginPage(ctx) {

const userData = getUserData();
if(userData){
  ctx.page.redirect('/catalog')
}else {

  updateView();
  function updateView(errMsg = '', missingFields = {}){
    ctx.render(loginPageTemplate(onLogin, errMsg, missingFields));
  }
  

  async function onLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();
try {
  
    if (username == "" || password == "") {
      const missingFields = [...formData.entries()].reduce((acc, [key, value]) => {
        if(value == ''){
          value = true;
        }else if(value != ''){
          value = false;
        }
        acc[key] = value;
        return acc;
      }, {});
     
      throw ({errMsg:"All fields are required!",  missingFields});
    }

    const response = await login(username, password);
    ctx.updateUserNav();
    ctx.page.redirect("/catalog");
} catch (error) {
    if(error.message){
      error.errMsg = error.message;
      error.missingFields = {
        username: true,
        password: true,
      }
    }
    updateView(error.errMsg, error.missingFields);
   }
  }
 }
}
