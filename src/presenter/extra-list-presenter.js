import AbstractListPresenter from './abstract-film-list-presenter';
import ExtraView from '../view/extra-view';

export default class ExtraListPresenter extends AbstractListPresenter {
  constructor(container, changeData, popupComponent, title) {
    super(container, changeData, popupComponent);

    this._title = title;
    this._filmListComponent = new ExtraView(this._title);
  }

  _renderList() {
    super._renderList();

    this._renderCards(0, 2);
  }
}