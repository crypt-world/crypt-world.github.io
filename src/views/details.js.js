import { createComment, deleteCurrency, getCommentsByCurrencyId, getCurrencyById } from "../api/data.js";
import { getUserData } from "../api/util.js";
import { html, until } from "../lib.js";


const detailsPageTemplate = (currencyPromise, currency, isOwner, onDelete, commentSection) => html` 
<div class="details-wrapper">
  <section class="crypto-currency-details-card">
    ${until(currencyPromise, html`<p>Loading &hellip;</p>`)}
    ${isOwner ? html`<div class="author-buttons">
                      <a href=${`/edit/${currency.objectId}`} class="card-author-edit-link">Edit</a>
                      <a @click=${onDelete} href="javascript:void(0)" class="card-author-delete-btn">Delete</a>
                     </div>`
              : null}
  </section>
  ${commentSection}
</div>`;


const cardTemplate = (currency) => html`
  <div class="crypto-currency-details-img-wrapper">
    <img class="crypto-currency-details-img" src=${currency.img} />
  </div>
  <h2 class="crypto-currency-name">${currency.name}</h2>
  <article class="crypto-currency-description-article">
    <p class="crypto-currency-description-article-paragraph">
      ${currency.description}
    </p>
  </article>
`;


const addCommentTemplate = (isUser, onComment, showAddComment, commentsPromise, currencyId) => html`
${isUser ? html`<section @click=${showAddComment} class="add-comment-section">
                  <h3 class="add-comment-section-heading">Click to add your Comment:</h3>
                  <form @submit=${(event) => onComment(currencyId, event)} class="add-comment-section-form">
                      <textarea name="add-comment-field"  cols="30" rows="10" class="add-comment-section-textarea"
                          placeholder="Comment..."></textarea>
                      <input class="add-comment-section-form-submit-btn" type="submit" value="Add comment">
                  </form>
                </section>`
         : null}

<section id="comments" class="comments-section">
<h3 class="comments-heading">Comments: </h3>
<ul class="comments-list">
    ${until(commentsPromise, html`<p>Loading &hellip;</p>`)}
</ul>
</section>`;


const commentCardTemplate = (comment) => html`
<li class="comments-list-item">
  <p class="comment-list-item-paragraph-date">${new Date(comment.createdAt).toLocaleString()}</p>
<p class="comments-list-item-paragraph">
    <strong>${comment.owner.username}:</strong> ${comment.content}
</p>
</li>`;


export async function detailsPage(ctx) {
  const userData = getUserData();
  const data =  await getCurrencyById(ctx.params.id);
  const isOwner = userData && userData.id == data.owner.objectId;
  const { results } = await getCommentsByCurrencyId(ctx.params.id)
  ctx.render(detailsPageTemplate(loadCurrency(ctx.params.id), data, isOwner, onDelete, addCommentTemplate(userData ,onComment, showAddComment, loadComment(results), ctx.params.id)));

  async function onDelete(){
    const confirmation = confirm(`Are you sure you want to delete ${data.name} currency?`)
    if(confirmation){
      const response = await deleteCurrency(ctx.params.id)
      ctx.page.redirect('/catalog')
    }
  }


  async function onComment(currencyId, event){
    event.preventDefault();
    const formData = new FormData(event.target);
    const addCommentField = formData.get('add-comment-field').trim();
  
    if(addCommentField == ''){
      alert('All fields are required!');
      return
    }
  
    const comment = {
      'content':addCommentField
    }
    const response = await createComment(currencyId, comment);
    event.target.reset();
    event.target.style.display = '';
    ctx.page.redirect(`/details/${ctx.params.id}`);
  }
  
}

async function loadCurrency (id) {
  const currency =  await getCurrencyById(id);
  return cardTemplate(currency);
}

function loadComment(commentArray) {
  if(commentArray.length == 0 ){
    return html`<p>No comments yet.</p>`
  }else {
    return commentArray.map(commentCardTemplate);
  }
}


function showAddComment(event) {
  let addCommentForm = '';
  if(event.target.tagName == 'SECTION'){
    addCommentForm = event.target.lastElementChild;
  }else if(event.target.tagName == 'H3'){
    addCommentForm = event.target.nextElementSibling;
  }else if(event.target.tagName != 'H3' || event.target.tagName != 'SECTION'){
    return
  }
  addCommentForm.style.display = addCommentForm.style.display == '' ? 'flex' : '';

}
