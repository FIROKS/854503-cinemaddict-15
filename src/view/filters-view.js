import AbstractView from './abstract-view';

const createFilterTemplate = ({type, name, count}, currentFilterType) => (`
    <a href="#${type}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}">${name}
    ${count !== null ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>
`);

export default class FiltersView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  _filterClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChange(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }

  getTemplate() {
    return (
      `<div class="main-navigation__items">
        ${this._filters.map((filter) => createFilterTemplate(filter, this._currentFilterType)).join('')}
      </div>`
    );
  }
}
