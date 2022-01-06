import { register } from "../api/data.js";
import { html, classMap } from "../lib.js";
import { getUserData } from "../api/util.js";

const registerPageTemplate = (onRegister, errMsg, missingFields) => html` <div
  class="register-fieldset-wrapper"
>
  <fieldset class="register-fieldset">
    <legend>Create your account</legend>
    <form @submit=${onRegister} class="register-form">
    ${errMsg.length > 0 ? html`<span class="create-form-error-message-span">${errMsg}</span>`
                          : null}
      <label class="username-label register-form-label">
        Enter your username * :
        <input
          class="register-form-input ${classMap({'error': missingFields.username})}"
          type="text"
          name="username"
          id="username-input"
        />
      </label>
      <label class="email-label register-form-label">
        Enter your email * :
        <input
          class="register-form-input ${classMap({'error': missingFields.email})}"
          type="email"
          name="email"
          id="email-input"
        />
      </label>
      <label class="password-label register-form-label">
        Enter your password * :
        <input
          class="register-form-input ${classMap({'error': missingFields.password})}"
          type="password"
          name="password"
          id="password-input"
        />
      </label>
      <label class="repeat-password-label register-form-label">
        Confirm your password * :
        <input
          class="register-form-input ${classMap({'error': missingFields.repass})}"
          type="password"
          name="repass"
          id="repass-input"
        />
      </label>
      <button class="submit-btn">Sign up</button>
      <span class="already-have-account"
        >Have already signed up?<a href="/login">Sign in</a>
      </span>
    </form>
  </fieldset>
</div>`;

export function registerPage(ctx) {

  const userData = getUserData();
  if(userData){
    ctx.page.redirect('/catalog')
  }else {

    updateView();
    function updateView(errMsg = '', missingFields = {}){
      ctx.render(registerPageTemplate(onRegister, errMsg, missingFields));
    }
  

  async function onRegister(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username").trim();
    const email = formData.get("email").trim();
    const password = formData.get("password").trim();
    const repass = formData.get("repass").trim();

try {

    if (username == "" || email == "" || password == "" || repass == "") {
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
    if (password !== repass) {
     throw ({errMsg: 'Passwords don\'t match!',
             missingFields: {password: true, repass: true}})
    }

    const response = await register(username, email, password);
    ctx.updateUserNav();
    ctx.page.redirect("/catalog");
} catch (error) {
  if(error.message){
    error.errMsg = error.message;
    error.missingFields = {
      username: true,
      email: true, 
    }
  }
  updateView(error.errMsg, error.missingFields);
   }
  }
 }
}