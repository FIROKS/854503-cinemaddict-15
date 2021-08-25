import ShowMoreView from '../view/show-more-view';
import MenuView from '../view/menu-view';
import UserRankView from '../view/user-view';
import SortView from '../view/sort-view';
import FilmsView from '../view/films-view';
import FooterStatsView from '../view/footer-stats-view';
import FiltersView from '../view/filters-view';
import EmptyListView from '../view/empty-list-view';
import { render, remove } from '../utils/render';
import { RenderPosition } from '../const';
import AbstractFilmListPresenter from './abstract-film-list-presenter';

const CARD_PER_STEP = 5;

export default class FilmListPresenter extends AbstractFilmListPresenter {
  constructor(container, topRatedComponent, mostCommentedComponent) {
    super(container);

    this._topRatedComponent = topRatedComponent;
    this._mostCommentedComponent = mostCommentedComponent;
    this._renderedCardsCount = CARD_PER_STEP;
    this._userRankComponent = new UserRankView();
    this._filmListComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._menuComponent = new MenuView();
    this._footerStatsComponent = new FooterStatsView();
    this._showMoreButtonComponent = new ShowMoreView();
    this._filterComponent = null;
    this._mainElement = document.querySelector('.main');

    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
  }

  _handleFilmChange(updatedFilm) {
    super._handleFilmChange(updatedFilm);
    this._topRatedComponent.filmsPresenters.has(updatedFilm.id) && this._topRatedComponent.filmsPresenters.get(updatedFilm.id).init(updatedFilm);
    this._mostCommentedComponent.filmsPresenters.has(updatedFilm.id) && this._mostCommentedComponent.filmsPresenters.get(updatedFilm.id).init(updatedFilm);
  }

  init(films, filtersData) {
    this._films = films.slice();
    this._filtersData = filtersData;

    this._renderList();
    this._renderInterface();
  }

  _renderInterface() {
    this._renderUser();
    this._renderFooterStats();
    this._renderSort();
    this._renderMenu();
    this._renderFilters();
  }

  _renderList() {
    render(this._container, this._filmListComponent, RenderPosition.AFTERBEGIN);

    this._filmListContainerElement = this._filmListComponent.getElement().querySelector('.films-list__container');

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

  _renderMenu() {
    render(this._mainElement, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilters() {
    this._filterComponent = new FiltersView(this._filtersData);

    render(this._menuComponent, this._filterComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._mainElement, this._sortComponent, RenderPosition.AFTERBEGIN);
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

  _renderUser() {
    const headerElement = document.querySelector('.header');

    render(headerElement, this._userRankComponent, RenderPosition.BEFOREEND);
  }

  _renderFooterStats() {
    const footerElement = document.querySelector('.footer');

    render(footerElement, this._footerStatsComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    render(this._filmListContainerElement, new EmptyListView(), RenderPosition.AFTERBEGIN);
  }

  _clearList() {
    remove(this._filmListComponent);
  }
}
