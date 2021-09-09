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

  init(films = []) {
    this._films = films.slice();
    this.renderList();
  }

  _reInit() {
    throw new Error('Abstract method not implemented: _reInit');
  }

  get filmsPresenters() {
    return this._filmsPresenters;
  }

  get filmListContainerElement() {
    return this._filmListContainerElement;
  }

  _renderCard(filmInfo) {
    const filmInstance = new FilmPresenter(this._filmListContainerElement, this._changeData, this._popupComponent);

    filmInstance.init(filmInfo);
    this._filmsPresenters.set(filmInfo.id, filmInstance);
  }

  _renderCards(films) {
    films.forEach((film) => this._renderCard(film));
  }

  renderList() {
    const prevComponent = this._filmListComponent;

    if (this._container.contains(prevComponent.getElement())) {
      this._reInit();
      remove(prevComponent);
    }

    render(this._container, this._filmListComponent, RenderPosition.BEFOREEND);
    this._filmListContainerElement = this._filmListComponent.getElement().querySelector('.films-list__container');
  }

  clearList(removeView = false) {
    this._filmsPresenters.forEach((presenter) => presenter.destroy());
    this._filmsPresenters.clear();

    if (removeView) {
      remove(this._filmListComponent);
    }
  }
}
