import { FilterTypes, RenderPosition, UpdateType } from '../const';
import { filter } from '../utils/filter';
import { remove, render, replace } from '../utils/render';
import FiltersView from '../view/filters-view';

export default class FilterPresenter {
  constructor(container, filterModel, filmModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._filmModel = filmModel;

    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);

    this._filmModel.addObserver(this._handleModelChange);
    this._filterModel.addObserver(this._handleModelChange);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView (filters, this._filterModel.currentFilter);
    this._filterComponent.setFilterTypeChange(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._container, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(prevFilterComponent, this._filterComponent);
    remove(prevFilterComponent);
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.currentFilter === filterType) {
      return;
    }

    this._filterModel.setCurrentFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelChange() {
    this.init();
  }

  _getFilters() {
    const films = this._filmModel.films;

    return [
      {
        type: FilterTypes.ALL,
        name: 'All movies',
        count: null,
      },
      {
        type: FilterTypes.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterTypes.WATCHLIST](films).length,
      },
      {
        type: FilterTypes.HISTORY,
        name: 'History',
        count: filter[FilterTypes.HISTORY](films).length,
      },
      {
        type: FilterTypes.FAVORITES,
        name: 'Favorites',
        count: filter[FilterTypes.FAVORITES](films).length,
      },
    ];
  }

  destroy() {
    remove(this._filterComponent);
    this._filterComponent = null;
  }
}
