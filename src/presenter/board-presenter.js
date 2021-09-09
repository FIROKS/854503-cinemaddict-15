import MenuView from '../view/menu-view';
import UserRankView from '../view/user-view';
import SortView from '../view/sort-view';
import FooterStatsView from '../view/footer-stats-view';
import FiltersView from '../view/filters-view';
import EmptyListView from '../view/empty-list-view';
import PopupPresenter from './popup-presenter';
import {createFilmMock} from '../mock/film-mock';
import {createFiltersMock} from '../mock/filters-mock';
import ExtraListPresenter from './extra-list-presenter';
import MainListPresenter from './list-presenter';
import { sortByCommentsAmount, sortByRating, updateItem, sortByDate } from '../utils/utils';
import { RenderPosition, Mode, SortTypes } from '../const';
import { render, remove } from '../utils/render';

const FILMS_AMOUNT = 17;
const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

export default class BoardPresenter {
  constructor() {
    this._mainListComponent = null;
    this._topRatedComponent = null;
    this._mostCommentedComponent = null;
    this._filterComponent = null;
    this._sortComponent = null;
    this._userRankComponent = new UserRankView();
    this._menuComponent = new MenuView();
    this._footerStatsComponent = new FooterStatsView();

    this._sourcedFilmMocks = new Array(FILMS_AMOUNT).fill().map(() => createFilmMock());
    this._filterMocks = createFiltersMock(this._sourcedFilmMocks);
    this._films = this._sourcedFilmMocks.slice();
    this._topRatedFilms = null;
    this._mostCommentedFilms = null;
    this._currentSortType = SortTypes.DEFAULT;

    this._filmsContainerElement = document.querySelector('.films');

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._popupComponent = new PopupPresenter(this._handleFilmChange);
    this._mainListComponent = new MainListPresenter(this._filmsContainerElement, this._handleFilmChange, this._popupComponent);
    this._topRatedComponent = new ExtraListPresenter(this._filmsContainerElement, this._handleFilmChange, this._popupComponent, 'Top rated');
    this._mostCommentedComponent = new ExtraListPresenter(this._filmsContainerElement, this._handleFilmChange, this._popupComponent, 'Most commented');
  }

  init() {
    this._sortTopRatedFilms();
    this._sortMostCommentedFilms();
    this._sortList();

    this._mainListComponent.init(this._films, this._filterMocks);
    this._topRatedComponent.init(this._topRatedFilms);
    this._mostCommentedComponent.init(this._mostCommentedFilms);

    this._renderInterface();
  }

  _handleFilmChange(updatedFilm, commentsChange) {
    this._films = updateItem(this._films, updatedFilm);
    this._popupComponent.init(updatedFilm);

    this._mainListComponent.filmsPresenters.get(updatedFilm.id).init(updatedFilm);
    this._topRatedComponent.filmsPresenters.has(updatedFilm.id) && this._topRatedComponent.filmsPresenters.get(updatedFilm.id).init(updatedFilm);
    this._mostCommentedComponent.filmsPresenters.has(updatedFilm.id) && this._mostCommentedComponent.filmsPresenters.get(updatedFilm.id).init(updatedFilm);

    // Если попап уже открыт, а данные изменились, то перерисовываем его
    if (this._popupComponent.mode === Mode.DETAILS) {
      this._popupComponent._renderPopup();
      if (commentsChange) {
        this._sortMostCommentedFilms();
        this._mostCommentedComponent.init(this._mostCommentedFilms);
      }
    }
  }

  _handleSortChange(newSortType) {
    if (this._currentSortType !== newSortType) {
      this._currentSortType = newSortType;
      this._clearBoard();
      this.init();
    }
  }

  _sortList() {
    switch (this._currentSortType) {
      case SortTypes.DATE: {
        this._films.sort(sortByDate);
        break;
      }
      case SortTypes.RATING: {
        this._films.sort(sortByRating);
        break;
      }
      default: {
        this._films = this._sourcedFilmMocks.slice();
      }
    }
  }

  _sortTopRatedFilms() {
    this._topRatedFilms = this._films.slice().sort(sortByRating);
  }

  _sortMostCommentedFilms() {
    this._mostCommentedFilms = this._films.slice().sort(sortByCommentsAmount);
  }

  _renderInterface() {
    this._renderUser();
    this._renderFooterStats();
    this._renderSort();
    this._renderMenu();
    this._renderFilters();
  }

  _renderMenu() {
    render(mainElement, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilters() {
    this._filterComponent = new FiltersView(this._filterMocks);

    render(this._menuComponent, this._filterComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);

    render(mainElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
  }

  _renderUser() {
    render(headerElement, this._userRankComponent, RenderPosition.BEFOREEND);
  }

  _renderFooterStats() {
    render(footerElement, this._footerStatsComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    render(this._filmListContainerElement, new EmptyListView(), RenderPosition.AFTERBEGIN);
  }

  _clearBoard() {
    this._mainListComponent.clearList(true);
    this._topRatedComponent.clearList(true);
    this._mostCommentedComponent.clearList(true);
    remove(this._sortComponent);
    remove(this._menuComponent);
    remove(this._filterComponent);
    remove(this._userRankComponent);
    remove(this._footerStatsComponent);
  }
}
