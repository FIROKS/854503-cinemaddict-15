import {createDetailsTemplate} from './view/details-view';
import {createCardTemplate} from './view/card-view';
import {createShowMoreTemplate} from './view/show-more-view';
import {createMenuTemplate} from './view/menu-view';
import {createUserTemplate} from './view/user-view';
import {createSortTemplate} from './view/sort-view';
import {createFilmsTemplate} from './view/films-view';
import {createExtraTemplate} from './view/extra-view';
import {createFooterStatsTemplate} from './view/footer-stats-view';

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

for (let i = 0; i < 5; i++) {
  renderTemplate(filmListContainerElement, createCardTemplate(), 'beforeend');
}

renderTemplate(filmListElement, createShowMoreTemplate(), 'beforeend');

renderTemplate(filmsElement, createExtraTemplate('Top rated'), 'beforeend');
renderTemplate(filmsElement, createExtraTemplate('Most commented'), 'beforeend');

const extraElements = mainElement.querySelectorAll('.films-list.films-list--extra');

for (const elem of extraElements) {
  const listElement = elem.querySelector('.films-list__container');

  for (let i = 0; i < 2; i++) {
    renderTemplate(listElement, createCardTemplate(), 'beforeend');
  }
}

renderTemplate(footerElement, createDetailsTemplate(), 'afterend');
