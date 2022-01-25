import { createCurrency, getAllCryptoCurrencies } from "../api/data.js";
import { parseQuery } from "../api/util.js";
import { html, until } from "../lib.js";

const catalogPageTemplate = (currencyPromise, onSearch, search = '', onPreviousPage, onNextPage, totalPagesAvailable, page=1) => html` <div
  class="catalog-wrapper"
>
  <section class="searchbar-and-pagination">
    <form @submit=${onSearch} class="searchbar-form">
      <label>
        <p class="searchbar-label-paragraph">Search currency</p>
        <input
          class="searchbar-form-search-input"
          type="search"
          name="search-bar"
          .value=${search}
        >
        <input class="searchbar-form-submit-btn" type="submit" value="Search" />
      </label>
    </form>
    <section class="first-pagination">
     ${page > 1 ? html` <button @click=${onPreviousPage} class="previous-button page-btn"><i class="fas fa-arrow-left"></i> Prev</button>` : ''}
      ${page < totalPagesAvailable ? html`<button @click=${onNextPage} class="next-button page-btn">Next <i class="fas fa-arrow-right"></i></button>` : '' }
    </section>
  </section>
  <section class="currency-cards">
    ${until(currencyPromise, html`<p>Loading &hellip;</p>`)}
  </section>
  <section class="second-pagination">
  ${page > 1 ? html` <button @click=${onPreviousPage} class="previous-button page-btn"><i class="fas fa-arrow-left"></i> Prev</button>` : ''}
      ${page < totalPagesAvailable ? html`<button @click=${onNextPage} class="next-button page-btn">Next <i class="fas fa-arrow-right"></i></button>` : '' }
  </section>
</div>`;

const currencyCardTemplate = (card) => html` <div class="currency-card-wrapper">
  <a href=${`/details/${card.objectId}`}
    ><img class="catalog-currency-card-img" src=${card.img} alt="Currency" />
    <p class="currency-card-name">${card.name}</p>
  </a>
</div>`;

export async function catalogPage(ctx) {
  const {page, search} = parseQuery(decodeURIComponent(ctx.querystring))
  
  const data = await getAllCryptoCurrencies(page || 1, search || '');
  const totalPagesAvailable = data.pages;

  ctx.render(catalogPageTemplate(createCurrencyCard(data), onSearch, search, onPreviousPage, onNextPage, totalPagesAvailable, page));

  function onPreviousPage(event){
    if(page == undefined || page - 1 == 0){
      return;
    }else {
      ctx.page.redirect(`/catalog?page=${page - 1}`);
    }
  }

  function onNextPage(event){
    if(page){
      ctx.page.redirect(`/catalog?page=${Number(page) + 1}`);
    }else {
      ctx.page.redirect(`/catalog?page=2`);
    }
  }
  
function onSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const search = formData.get('search-bar').trim();
  if(search !== ''){
    ctx.page.redirect(`/catalog?search=${encodeURIComponent(search)}`)
  }else {
    ctx.page.redirect('/catalog?page=1')
  }
}

}

 async function createCurrencyCard(data) {
  const currencies = data.results;


  if (currencies.length == 0) {
    return html`<p>
      No data in database. Be the first to create a crypto currency
    </p>`;
  } else {
    return currencies.map(currencyCardTemplate);
  }
}


function pagerSetup(page, data, search) {
  return async () => {
      const { pages } = await data;

      return html`
          Page ${page} of ${pages}
          ${page > 1 ? html`<a class="pager" href=${'/catalog/' + createQuery(page - 1, search)}>&lt;
              Prev</a>` : ''}
          ${page < pages ? html`<a class="pager" href=${'/catalog/' + createQuery(page + 1, search)}>Next
              &gt;</a>` : ''}`;
  };
}