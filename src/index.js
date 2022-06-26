import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function inputClear() {
    refs.info.innerHTML = "";
    refs.list.innerHTML = "";
};

function onInputSearch(event) {
    const inputValue = event.target.value.trim();  
    if (inputValue === "") {
        inputClear();
        return;
    };  

    fetchCountries(inputValue)
        .then(renderHTML)
        .catch(error => {
            inputClear();
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

function renderHTML(country) {
    if (country.length > 10) {
        inputClear();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;

    } else if (country.length === 1) {
        inputClear();
        renderCountryCard(country);
        return;
        
    } inputClear();
    renderCountryList(country);
    return;
       
};
 
function renderCountryList(countriesArr) {
    const markup = countriesArr.map(({ flags, name }) => {
        return `<li class="country_item">
        <p><img src="${flags.svg}" width="50px"/>
        ${name.official}</p>
        </li>`;
    }).join('');
    refs.list.insertAdjacentHTML('beforeend', markup);
};

function renderCountryCard(country) {
    const markup = country.map(({ flags, name, capital, population, languages }) => {
        return `<div class="country-card">
        <h1><img src="${flags.svg}" width="70px"/>
        ${name.official}
        </h1>        
        <p><span>Capital:</span> ${capital}</p>
        <p><span>Population:</span> ${population}</p>
        <p><span>Languages:</span> ${Object.values(languages).join(', ')}</p>
        </div>`;
    }).join('');
    refs.info.insertAdjacentHTML('beforeend', markup);
};