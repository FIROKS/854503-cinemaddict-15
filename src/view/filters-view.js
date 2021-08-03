import { capitalizeFirstLetter } from '../utils/utils';

const createFilterTemplate = (filter) => {
  const {name, count} = filter;

  return (`
    <a href="#${name}" class="main-navigation__item">${capitalizeFirstLetter(name)} <span class="main-navigation__item-count">${count}</span></a>
  `);
};

export const createFiltersTemplate = (filters) => (`
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filters.map((filter) => createFilterTemplate(filter)).join('')}
  </div>
`);
