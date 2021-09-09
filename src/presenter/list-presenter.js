
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

  _reInit() {
    this.clearList();
    this._filmListComponent = new FilmsView();
  }

  renderList() {
    super.renderList();

    if (this._films.length === 0) {
      return;
    }

    this._renderCards(this._films.slice(0, Math.min(this._films.length, this._renderedCardsCount)));

    if (this._films.length > this._renderedCardsCount) {
      this._renderShowMore();
    }
  }

  _handleShowMoreClick() {
    const cardCount = this._films.length;
    const newRenderedCards = Math.min(cardCount, this._renderedCardsCount + CARD_PER_STEP);
    const cards = this._films.slice(this._renderedCardsCount, newRenderedCards);

    this._renderedCardsCount = newRenderedCards;
    this._renderCards(cards);

    if (this._renderedCardsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMore() {
    const filmListElement = this._container.querySelector('.films-list');

    render(filmListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.getElement().addEventListener('click', this._handleShowMoreClick);
  }

  clearList(removeView, resetRenderedCardsCount) {
    super.clearList(removeView);

    if (resetRenderedCardsCount) {
      this._renderedCardsCount = CARD_PER_STEP;
    }
    remove(this._showMoreButtonComponent);
  }
}
