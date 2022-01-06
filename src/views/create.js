import { createCurrency, createPointer } from "../api/data.js";
import { getUserData } from "../api/util.js";
import { html, classMap } from "../lib.js";

const createPageTemplate = (onCreate, errMsg, missingFields) => html` <div
  class="create-fieldset-wrapper"
>
  <fieldset class="create-fieldset">
    <legend>Create your currency</legend>
    <form @submit=${onCreate} class="create-form">
      ${errMsg.length > 0 ? html`<span class="create-form-error-message-span">All fields are required!</span>`
                          : null}
      <label class="create-form-label">
        Currency name * :
        <input class="create-form-label-input  ${classMap({'error': missingFields.name})}" type="text" name="name" />
      </label>
      <label class="create-form-label">
        Currency IMG URL * :
        <input class="create-form-label-input ${classMap({'error': missingFields.img})}" type="text" name="img" />
      </label>
      <label class="create-form-label">
        <p class="create-form-label-paragraph">Description * :</p>
        <textarea
        class="create-form-description-textarea ${classMap({'error': missingFields.description})}"
          name="description"
          id="create-form-textarea"
          cols="30"
          rows="10"
        ></textarea>
      </label>
      <button class="submit-btn">Create</button>
    </form>
  </fieldset>
</div>`;

export function createPage(ctx) {

  const userData = getUserData();
if(userData == null){
    ctx.page.redirect('/catalog');
    return
}else {
  updateView();
  function updateView(errMsg = '', missingFields = {}){
    ctx.render(createPageTemplate(onCreate, errMsg, missingFields));
  }

  async function onCreate(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const name = formData.get("name").trim();
    const img = formData.get("img").trim();
    const descr = formData.get("description").trim();
try {
  
    if (name == "" || img == "" || descr == "") {
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
    }else {
      const userData = getUserData();

      const data = {
        name,
        description: descr,
        img,
        cryptoChart: "",
        owner: createPointer('_User', userData.id)
      };
      const response = await createCurrency(data);
      ctx.page.redirect("/catalog");
    }
  } catch (error) {
    updateView(error.errMsg, error.missingFields);
  }
  }
}
}
