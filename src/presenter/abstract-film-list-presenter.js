import { RenderPosition } from '../const';

import { remove, render } from '../utils/render';
import FilmPresenter from './card-presenter';

export default class AbstractListPresenter {
  constructor(container, changeData, popupComponent) {
    this._container = container;
    this._changeData = changeData;
    this._popupComponent = popupComponent;

    this._filmsPresenters = new Map();
    this._films = null;
    this._filmListContainerElement = null;
    this._filmListComponent = null;
  }

  init(films) {
    this._films = films.slice();
    this._renderList();
  }


  get filmsPresenters() {
    return this._filmsPresenters;
  }

  _renderCard(filmInfo) {
    const filmInstance = new FilmPresenter(this._filmListContainerElement, this._changeData, this._popupComponent);

    filmInstance.init(filmInfo);
    this._filmsPresenters.set(filmInfo.id, filmInstance);
  }

  _renderCards(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderCard(film));
  }

  _renderList() {
    render(this._container, this._filmListComponent, RenderPosition.BEFOREEND);

    this._filmListContainerElement = this._filmListComponent.getElement().querySelector('.films-list__container');
  }

  clearList() {
    this._filmsPresenters.forEach((presenter) => presenter.destroy());
    this._filmsPresenters.clear();
    remove(this._filmListComponent);
  }
}
