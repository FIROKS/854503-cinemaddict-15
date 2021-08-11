import { capitalizeFirstLetter } from '../utils/utils';
import AbstractView from './abstract-view';

const createFilterTemplate = (filter) => {
  const {name, count} = filter;

  return (`
    <a href="#${name}" class="main-navigation__item">${capitalizeFirstLetter(name)} <span class="main-navigation__item-count">${count}</span></a>
  `);
};

export default class FiltersView extends AbstractView{
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return (
      `<div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${this._filters.map((filter) => createFilterTemplate(filter)).join('')}
      </div>`
    );
  }
}
