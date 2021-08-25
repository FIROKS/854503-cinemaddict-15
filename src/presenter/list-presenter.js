
import FilmsView from '../view/films-view';
import ShowMoreView from '../view/show-more-view';
import { render, remove } from '../utils/render';
import AbstractListPresenter from './abstract-film-list-presenter';
import { RenderPosition } from '../const';

const CARD_PER_STEP = 5;

export default class MainListPresenter extends AbstractListPresenter {
  constructor(container, changeData, popupComponent) {
    super(container, changeData, popupComponent);

    this._renderedCardsCount = CARD_PER_STEP;
    this._filmListComponent = new FilmsView();
    this._showMoreButtonComponent = new ShowMoreView();

    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
  }

  _renderList() {
    super._renderList();

    if (this._films.length === 0) {
      this._renderEmptyList();
      this._sortComponent.getElement().remove();
    } else {
      this._renderCards(0, Math.min(this._films.length, CARD_PER_STEP));
    }

    if (this._films.length > CARD_PER_STEP) {
      this._renderShowMore();
    }
  }

  _handleShowMoreClick() {
    this._renderCards(this._renderedCardsCount, this._renderedCardsCount + CARD_PER_STEP);
    this._renderedCardsCount += CARD_PER_STEP;

    if (this._renderedCardsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMore() {
    const filmListElement = this._container.querySelector('.films-list');

    render(filmListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.getElement().addEventListener('click', this._handleShowMoreClick);
  }

  clearList() {
    super.clearList();

    this._renderedCardsCount = CARD_PER_STEP;
    remove(this._showMoreButtonComponent);
  }
}
