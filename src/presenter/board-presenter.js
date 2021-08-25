import ShowMoreView from '../view/show-more-view';
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
import { sortMostComment, sortTopRated, updateItem } from '../utils/utils'
import { RenderPosition, Mode } from '../const';
import { render, remove, replace } from '../utils/render';

const FILMS_AMOUNT = 17;

export default class BoardPresenter {
  constructor() {
    this._mainListComponent = null;
    this._topRatedComponent = null;
    this._mostCommentedComponent = null;
    this._filterComponent = null;
    this._userRankComponent = new UserRankView();
    this._sortComponent = new SortView();
    this._menuComponent = new MenuView();
    this._footerStatsComponent = new FooterStatsView();
    this._popupComponent = new PopupPresenter();

    this._sourcedFilmMocks = new Array(FILMS_AMOUNT).fill().map(() => createFilmMock());
    this._filterMocks = createFiltersMock(this._sourcedFilmMocks);
    this._topRatedFilms = null;
    this._mostCommentedFilms = null;

    this._mainElement = document.querySelector('.main');
    this._filmsContainerElement = document.querySelector('.films');

    this._handleFilmChange = this._handleFilmChange.bind(this);
  }

  init() {
    this._films = this._sourcedFilmMocks.slice();
    this._mainListComponent = new MainListPresenter(this._filmsContainerElement, this._handleFilmChange, this._popupComponent);
    this._topRatedComponent = new ExtraListPresenter(this._filmsContainerElement, this._handleFilmChange, this._popupComponent);
    this._mostCommentedComponent = new ExtraListPresenter(this._filmsContainerElement, this._handleFilmChange, this._popupComponent);

    this._sortForExtraSections();

    this._mainListComponent.init(this._films, this._filterMocks);
    this._topRatedComponent.init('Top rated', this._topRatedFilms);
    this._mostCommentedComponent.init('Most commented', this._mostCommentedFilms);

    this._renderInterface();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._popupComponent.init(updatedFilm);

    this._mainListComponent.filmsPresenters.get(updatedFilm.id).init(updatedFilm);
    this._topRatedComponent.filmsPresenters.has(updatedFilm.id) && this._topRatedComponent.filmsPresenters.get(updatedFilm.id).init(updatedFilm);
    this._mostCommentedComponent.filmsPresenters.has(updatedFilm.id) && this._mostCommentedComponent.filmsPresenters.get(updatedFilm.id).init(updatedFilm);

    // Если попап уже открыт, а данные изменились, то перерисовываем его
    if (this._popupComponent.mode === Mode.DETAILS) {
      this._popupComponent._renderPopup();
    }
  }

  _sortForExtraSections() {
    this._topRatedFilms = this._films.slice().sort(sortTopRated);
    this._mostCommentedFilms = this._films.slice().sort(sortMostComment);
  }

  _renderInterface() {
    this._renderUser();
    this._renderFooterStats();
    this._renderSort();
    this._renderMenu();
    this._renderFilters();
  }

  _renderMenu() {
    render(this._mainElement, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilters() {
    this._filterComponent = new FiltersView(this._filterMocks);

    render(this._menuComponent, this._filterComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._mainElement, this._sortComponent, RenderPosition.AFTERBEGIN);
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
    remove(this._MainListComponent);
  }
}
