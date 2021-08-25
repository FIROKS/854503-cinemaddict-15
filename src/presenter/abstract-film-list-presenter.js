import { Mode } from '../const';
import { updateItem } from '../utils/utils'
import FilmPresenter from './card-presenter';
import PopupPresenter from './popup-presenter';

export default class AbstractFilmListPresenter {
  constructor(container) {
    this._container = container;

    this._filmsPresenters = new Map();
    this._films = null;
    this._filmListContainerElement = null;
    this._popupComponent = new PopupPresenter();

    this._handleFilmChange = this._handleFilmChange.bind(this);
  }
  
  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._popupComponent.init(updatedFilm);
    this._filmsPresenters.get(updatedFilm.id).init(updatedFilm);

    // Если попап уже открыт, а данные изменились, то перерисовываем его
    if (this._popupComponent.mode === Mode.DETAILS) {
      this._popupComponent._renderPopup();
    }
  }

  get filmsPresenters() {
    return this._filmsPresenters;
  }

  _renderCard(filmInfo) {
    const filmInstance = new FilmPresenter(this._filmListContainerElement, this._handleFilmChange, this._popupComponent);

    filmInstance.init(filmInfo);
    this._filmsPresenters.set(filmInfo.id, filmInstance);
  }

  _renderCards(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderCard(film));
  }
}
