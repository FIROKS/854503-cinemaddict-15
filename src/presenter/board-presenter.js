import MenuView from '../view/menu-view';
import UserRankView from '../view/user-view';
import SortView from '../view/sort-view';
import FooterStatsView from '../view/footer-stats-view';
import EmptyListView from '../view/empty-list-view';
import PopupPresenter from './popup-presenter';
import ExtraListPresenter from './extra-list-presenter';
import MainListPresenter from './list-presenter';
import { sortByCommentsAmount, sortByRating, sortByDate } from '../utils/utils';
import { RenderPosition, Mode, SortTypes, ActionTypes, UpdateType } from '../const';
import { render, remove } from '../utils/render';
import FilterPresenter from './filter-presenter';
import FilterModel from '../model/filter-model';
import { filter } from '../utils/filter';
import StatsView from '../view/stats-view';
import LoadingView from '../view/loading-view';
import { State as ViewState } from '../const';
import CommentsModel from '../model/comments-model';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

export default class BoardPresenter {
  constructor(filmModel, api) {
    this._mainListComponent = null;
    this._topRatedComponent = null;
    this._mostCommentedComponent = null;
    this._sortComponent = null;
    this._userRankComponent = null;
    this._menuComponent = new MenuView();
    this._footerStatsComponent = null;
    this._filmModel = filmModel;
    this._filterModel = new FilterModel();
    this._loadingComponent = new LoadingView();
    this._statsComponent = null;
    this._api = api;
    this._isLoading = true;
    this._commentsModel = new CommentsModel(this._api);

    this._topRatedFilms = null;
    this._mostCommentedFilms = null;
    this._currentSortType = SortTypes.DEFAULT;

    this._filmsContainerElement = document.querySelector('.films');

    this._handleSortChange = this._handleSortChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._popupComponent = new PopupPresenter(this._handleViewAction, this._commentsModel);
    this._mainListComponent = new MainListPresenter(this._filmsContainerElement, this._handleViewAction, this._popupComponent);
    this._topRatedComponent = new ExtraListPresenter(this._filmsContainerElement, this._handleViewAction, this._popupComponent, 'Top rated');
    this._mostCommentedComponent = new ExtraListPresenter(this._filmsContainerElement, this._handleViewAction, this._popupComponent, 'Most commented');

    this._filmModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderInterface();
    this._renderBoard();
  }

  _renderStats() {
    this._statsComponent = new StatsView(this._filmModel.films);
    render(mainElement, this._statsComponent, RenderPosition.BEFOREEND);
    this._statsComponent._setChart();
  }

  _handleStatsClick() {
    this._clearBoard();
    this._renderInterface();
    this._renderStats();
    this._sortComponent.getElement().remove();
  }

  _renderBoard() {
    if (this._isLoading) {
      this._mainListComponent.init();
      this._renderLoading();
      return;
    }
    const filmCount = this._getFilms().length;
    this._sortTopRatedFilms();
    this._sortMostCommentedFilms();

    if (filmCount === 0) {
      this._mainListComponent.init();
      this._renderEmptyList();
      this._sortComponent.getElement().remove();
    } else {
      this._mainListComponent.init(this._getFilms());
      this._topRatedComponent.init(this._topRatedFilms);
      this._mostCommentedComponent.init(this._mostCommentedFilms);
    }
  }

  _getFilms() {
    const currentFilterType = this._filterModel.currentFilter;
    const films = this._filmModel.films;
    const filteredFilms = filter[currentFilterType](films);

    switch (this._currentSortType) {
      case SortTypes.DATE: {
        return filteredFilms.sort(sortByDate);
      }
      case SortTypes.RATING: {
        return filteredFilms.sort(sortByRating);
      }
    }

    return filteredFilms;
  }

  _handleViewAction(userAction, updateType, update) {
    switch (userAction) {
      case ActionTypes.ADD_COMMENT: {
        this._popupComponent.setViewState(ViewState.SAVING);
        this._api.addComment(update)
          .then((response) => {
            this._commentsModel.addComment(updateType, response);
          })
          .catch(() => {
            this._popupComponent.setViewState(ViewState.ABORTING);
          });
        break;
      }
      case ActionTypes.DELETE_COMMENT: {
        this._popupComponent.setViewState(ViewState.DELETING, update.commentId);
        this._api.deleteComment(update.commentId)
          .then(() => {
            this._commentsModel.deleteComment(updateType, update, this._filmModel);
          })
          .catch(() => {
            this._popupComponent.setViewState(ViewState.ABORTING);
          });
        break;
      }
      case ActionTypes.UPDATE_FILM: {
        this._updateFilmViewState(update, ViewState.UPDATING);
        this._api.updateFilm(update)
          .then(() => {
            this._filmModel.updateFilm(updateType, update);
          })
          .catch(() => {
            this._updateFilmViewState(update, ViewState.ABORTING);
            this._popupComponent.setViewState(ViewState.ABORTING);
          });
        break;
      }
    }
  }

  _handleModelEvent(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH: {
        this._clearBoard();
        this._renderInterface();
        this._renderBoard();

        if (this._popupComponent.mode === Mode.DETAILS) {
          this._popupComponent.init(update);
          this._popupComponent.openPopup();
        }
        break;
      }

      case UpdateType.MINOR: {
        this._mainListComponent.filmsPresenters.get(update.id).init(update);

        this._topRatedComponent.filmsPresenters.has(update.id) && this._topRatedComponent.filmsPresenters.get(update.id).init(update);

        this._mostCommentedComponent.filmsPresenters.has(update.id) && this._mostCommentedComponent.filmsPresenters.get(update.id).init(update);

        if (this._popupComponent.mode === Mode.DETAILS) {

          this._popupComponent.init(update);
          this._popupComponent.openPopup();

          this._sortMostCommentedFilms();
          this._mostCommentedComponent.init(this._mostCommentedFilms);
        }
        break;
      }
      case UpdateType.MAJOR: {
        this._clearBoard(true, true);
        this._renderInterface();
        this._renderBoard();
        if (this._popupComponent.mode === Mode.DETAILS) {
          this._popupComponent.openPopup();
        }
        break;
      }
      case UpdateType.INIT: {
        this._isLoading = false;
        this._clearBoard();
        this._renderInterface();
        this._renderBoard();
      }
    }
  }

  _updateFilmViewState(update, state) {
    this._mainListComponent.filmsPresenters.get(update.id).setViewState(state);

    this._topRatedComponent.filmsPresenters.has(update.id) && this._topRatedComponent.filmsPresenters.get(update.id).setViewState(state);

    this._mostCommentedComponent.filmsPresenters.has(update.id) && this._mostCommentedComponent.filmsPresenters.get(update.id).setViewState(state);
  }

  _handleSortChange(newSortType) {
    if (this._currentSortType !== newSortType) {
      this._currentSortType = newSortType;
      this._clearBoard();
      this.init();
    }
  }

  _sortTopRatedFilms() {
    this._topRatedFilms = this._filmModel.films.slice().sort(sortByRating);
  }

  _sortMostCommentedFilms() {
    this._mostCommentedFilms = this._filmModel.films.slice().sort(sortByCommentsAmount);
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

    this._menuComponent.setStatsClickHandler(this._handleStatsClick);
  }

  _renderFilters() {
    this._filterComponent = new FilterPresenter(this._menuComponent.getElement(), this._filterModel, this._filmModel);
    this._filterComponent.init();
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);

    render(mainElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
  }

  _renderUser() {
    this._userRankComponent = new UserRankView(this._filmModel.films);
    render(headerElement, this._userRankComponent, RenderPosition.BEFOREEND);
  }

  _renderFooterStats() {
    this._footerStatsComponent = new FooterStatsView(this._filmModel.films.length);
    render(footerElement, this._footerStatsComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    render(this._mainListComponent.filmListContainerElement, new EmptyListView(this._filterModel.currentFilter), RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._mainListComponent.filmListContainerElement, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _clearBoard(resetRenderedCardsCount = false, resetFilterType = false) {
    if (resetFilterType) {
      this._currentSortType = SortTypes.DEFAULT;
    }
    this._mainListComponent.clearList(true, resetRenderedCardsCount);
    this._topRatedComponent.clearList(true);
    this._mostCommentedComponent.clearList(true);
    this._filterComponent.destroy();
    remove(this._sortComponent);
    remove(this._menuComponent);
    remove(this._userRankComponent);
    remove(this._footerStatsComponent);
    if (this._statsComponent) {
      remove(this._statsComponent);
      this._statsComponent = null;
    }
  }
}
