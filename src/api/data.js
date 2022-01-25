import * as api from "./api.js";
import { getUserData } from "./util.js";

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const pageSize = 4;

const endpoints = {
  allCryptoCurrencies:"/classes/CryptoCurrency",
  searchCryptoCurrencies: (query) => `/classes/CryptoCurrency?where=${createQuery(query)}`,
  paginationEndPoint: (page) => `/classes/CryptoCurrency?skip=${(page - 1) * pageSize}&limit=${pageSize}`,
  getCurrencyById: (id) => `/classes/CryptoCurrency/${id}`,
  createCurrency: "/classes/CryptoCurrency",
  editCurrency: (id) => `/classes/CryptoCurrency/${id}`,
  deleteCurrency: (id) => `/classes/CryptoCurrency/${id}`,
  comment: '/classes/Comment',
  commentsByCurrencyId: (currencyId) => `/classes/Comment?where=${createPointerQuery('cryptoCurrency', 'CryptoCurrency', currencyId)}&include=owner&order=-createdAt`, 
};

export function createPointerQuery (propName, className, objectId) {
  return createQuery({[propName]: createPointer(className, objectId)})
}

export function createQuery (query){
  return encodeURIComponent(JSON.stringify(query));
}

export function createPointer(className, objectId){
  return {
    __type: 'Pointer',
    className,
    objectId
  }
}


export async function getAllCryptoCurrencies(page=1, query={}) {
  const data = await (() => {
    if (query) {
        query = {
            name: {
                $text: {
                    $search: {
                        $term: query,
                        $caseSensitive: false
                    }
                }
            }
        };
        return api.get(endpoints.searchCryptoCurrencies(query));
    } else {
        return api.get(endpoints.paginationEndPoint(page, pageSize));
    }
})();
const allData = await api.get(endpoints.allCryptoCurrencies);
data.pages = Math.ceil(allData.results.length / pageSize);

return data;
}

export async function getCurrencyById(id) {
  return api.get(endpoints.getCurrencyById(id));
}

export async function createCurrency(data) {
  return api.post(endpoints.createCurrency, data);
}

export async function editCurrency(id, data) {
  return api.put(endpoints.editCurrency(id), data);
}

export async function deleteCurrency(id) {
  return api.del(endpoints.deleteCurrency(id));
}

export async function getCommentsByCurrencyId(id) {
  return api.get(endpoints.commentsByCurrencyId(id));
}


export async function createComment(currencyId, comment) {
  comment.cryptoCurrency = createPointer('CryptoCurrency', currencyId);
  const userData = getUserData();
  comment.owner = createPointer('_User', userData.id)
  return api.post(endpoints.comment, comment);
}