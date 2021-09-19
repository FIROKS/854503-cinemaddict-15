import AbstractListPresenter from './abstract-film-list-presenter';
import ExtraView from '../view/extra-view';

export default class ExtraListPresenter extends AbstractListPresenter {
  constructor(container, changeData, popupComponent, title) {
    super(container, changeData, popupComponent);

    this._title = title;
    this._filmListComponent = new ExtraView(this._title);
  }

  _reInit() {
    this.clearList();
    this._filmListComponent = new ExtraView(this._title);
  }

  renderList() {
    super.renderList();

    this._renderCards(this._films.slice(0, 2));
  }
}
