import {createPopupTemplate} from './view/popup-view';
import {createCardTemplate} from './view/card-view';
import {createShowMoreTemplate} from './view/show-more-view';
import {createMenuTemplate} from './view/menu-view';
import {createUserTemplate} from './view/user-view';
import {createSortTemplate} from './view/sort-view';
import {createFilmsTemplate} from './view/films-view';
import {createExtraTemplate} from './view/extra-view';
import {createFooterStatsTemplate} from './view/footer-stats-view';
import { createFilmMock } from './mock/film-mock';

const FILM_PER_STEP = 5;
const FILMS_AMOUNT = 22;

const filmMocks = new Array(FILMS_AMOUNT).fill().map(() => createFilmMock());

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderTemplate(headerElement, createUserTemplate(), 'beforeend');
renderTemplate(footerElement, createFooterStatsTemplate(), 'beforeend');

renderTemplate(mainElement, createFilmsTemplate(), 'afterbegin');
renderTemplate(mainElement, createSortTemplate(), 'afterbegin');
renderTemplate(mainElement, createMenuTemplate(), 'afterbegin');

const filmListContainerElement = mainElement.querySelector('.films-list__container');
const filmListElement = mainElement.querySelector('.films-list');
const filmsElement = mainElement.querySelector('.films');

for (let i = 0; i < FILM_PER_STEP; i++) {
  renderTemplate(filmListContainerElement, createCardTemplate(filmMocks[i]), 'beforeend');
}

renderTemplate(filmListElement, createShowMoreTemplate(), 'beforeend');

renderTemplate(filmsElement, createExtraTemplate('Top rated'), 'beforeend');
renderTemplate(filmsElement, createExtraTemplate('Most commented'), 'beforeend');

const extraElements = mainElement.querySelectorAll('.films-list.films-list--extra');

for (const elem of extraElements) {
  const listElement = elem.querySelector('.films-list__container');

  for (let i = 0; i < 2; i++) {
    renderTemplate(listElement, createCardTemplate(filmMocks[i]), 'beforeend');
  }
}

renderTemplate(footerElement, createPopupTemplate(filmMocks[0]), 'afterend');

const popupElement = document.querySelector('.film-details');
const closeButtonElement = popupElement.querySelector('.film-details__close-btn');

closeButtonElement.addEventListener('click', () => popupElement.style.display = 'none');
