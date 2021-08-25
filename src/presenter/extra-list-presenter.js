import AbstractFilmListPresenter from './abstract-film-list-presenter';
import ExtraView from '../view/extra-view';
import { render } from '../utils/render';
import { RenderPosition } from '../const';


export default class ExtraListPresenter extends AbstractFilmListPresenter {

  init(title, films) {
    this._films = films.slice();
    this._title = title;

    this._renderExtraList();
  }

  _renderExtraList() {
    const extraComponent = new ExtraView(this._title);

    this._filmListContainerElement = extraComponent.getElement().querySelector('.films-list__container');

    render(this._container, extraComponent, RenderPosition.BEFOREEND);

    this._renderCards(0, 2);
  }
}
