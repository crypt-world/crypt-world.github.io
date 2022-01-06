import { editCurrency, getCurrencyById } from "../api/data.js";
import { getUserData } from "../api/util.js";
import { html, classMap } from "../lib.js";

const editPageTemplate = (currency, onEdit, errMsg, missingFields) => html` <div class="edit-fieldset-wrapper">
<fieldset class="edit-fieldset">
    <legend>Edit your currency</legend>
    <form @submit=${onEdit} class="edit-form">
    ${errMsg.length > 0 ? html`<span class="create-form-error-message-span">All fields are required!</span>`
                          : null}
        <label class="edit-form-label">
            Currency name * :
            <input class="edit-form-label-input ${classMap({'error': missingFields.name})}" type="text" name="name" .value=${currency.name}>
        </label>
        <label class="edit-form-label">
            Currency IMG URL * :
            <input class="edit-form-label-input ${classMap({'error': missingFields.img})}" type="text" name="img" .value=${currency.img}>
        </label>
        <label class="edit-form-label">
            <p class="edit-form-label-paragraph">Description * :</p>
            <textarea class="edit-form-description-textarea ${classMap({'error': missingFields.description})}" name="description" id="edit-form-textarea" cols="30" rows="10" .value=${currency.description}></textarea>
        </label>
      <button class="submit-btn">Update</button>
    </form>
</fieldset>
</div>
</main>`;

export  async function editPage(ctx) {
    const userData = getUserData();
    const data = await getCurrencyById(ctx.params.id);
    if(userData == null || userData.id !== data.owner.objectId){
        ctx.page.redirect('/catalog')
        return;
    }
    updateView();
  function updateView(errMsg = '', missingFields = {}){
    ctx.render(editPageTemplate(data, onEdit, errMsg, missingFields));
  }
    async function onEdit(event) {
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
        } else {
            const data = {
                name,
                description: descr,
                img,
            };

        const response = await editCurrency(ctx.params.id, data);
        ctx.page.redirect(`/details/${ctx.params.id}`);    
    }
} catch (error) {
    updateView(error.errMsg, error.missingFields);
}
}
}
