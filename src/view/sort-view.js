import AbstractView from './abstract-view';

const sortTypes = [
  ['default', 'Sort by default'],
  ['date', 'Sort by date'],
  ['rating', 'Sort by rating'],
]

const createSortTemplate = ([sortData, sortText], currentSortType) => `<li><a href="#" class="sort__button ${sortData === currentSortType ? 'sort__button--active' : ''}" data-sort-type="${sortData}">${sortText}</a></li>`;

export default class SortView extends AbstractView {
  constructor(sortType) {
    super();
    this._currentSortType = sortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    
    evt.preventDefault();
    const newSortType = evt.target.dataset.sortType;

    this._callback.sortTypeChange(newSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;

    this._element.addEventListener('click', this._sortTypeChangeHandler);
  }

  getTemplate() {
    return (
      `<ul class="sort">
        ${sortTypes.map((type) => createSortTemplate(type, this._currentSortType)).join('')}
      </ul>`
    );
  }
}
