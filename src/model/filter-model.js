import { FilterTypes } from '../const';
import Observer from '../utils/observer';

export default class FilterModel extends Observer {
  constructor() {
    super();

    this._currentFilter = FilterTypes.ALL;
  }

  get currentFilter() {
    return this._currentFilter;
  }

  setCurrentFilter(updateType, filter) {
    this._currentFilter = filter;
    this._notify(updateType, filter);
  }
}
