import { ActionTypes, UpdateType } from '../const';
import { getDurationFormat, getYear } from '../utils/film';
import SmartView from './smart-view';

const buttonType = [
  ['add-to-watchlist', 'Add to watchlist', 'inWatchlist'],
  ['mark-as-watched', 'Mark as watched', 'inHistory'],
  ['favorite', 'Mark as favorite', 'inFavorites'],
];

const formatDescription = (text) => {
  let formatedText = text;
  if (formatedText.length > 140) {
    formatedText = `${formatedText.slice(0, 139)}…`;
  }

  return formatedText;
};

const createTypesTemplate = (types, isDisabled, filmData) => {
  const createTypeTemplate = ([buttonClass, buttonText, buttonProp]) => (`
  <button class="film-card__controls-item film-card__controls-item--${buttonClass} ${filmData[buttonProp] ? 'film-card__controls-item--active' : ''}" type="button" ${isDisabled ? 'disabled' : ''}>${buttonText}</button>
  `);

  return (`
  <div class="film-card__controls">
    ${types.map((type) => createTypeTemplate(type)).join('')}
  </div>
  `);
};

export default class CardView extends SmartView {
  constructor(filmData) {
    super();
    this._filmData = filmData;

    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentClickHandler = this._commentClickHandler.bind(this);
    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  restoreHandlers() {
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setTitleClickHandler(this._callback.titleClick);
    this.setCommentClickHandler(this._callback.commentClick);
    this.setPosterHandler(this._callback.posterClick);
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete (data.isDisabled);

    return data;
  }

  _titleClickHandler(evt) {
    evt.preventDefault();

    this._callback.titleClick();
  }

  _commentClickHandler(evt) {
    evt.preventDefault();

    this._callback.commentClick();
  }

  _posterClickHandler(evt) {
    evt.preventDefault();

    this._callback.posterClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();

    this._callback.favoriteClick(
      ActionTypes.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        CardView.parseDataToFilm(this._filmData),
        {
          inFavorites: !this._filmData.inFavorites,
        },
      ),
    );
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();

    this._callback.watchedClick(
      ActionTypes.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        CardView.parseDataToFilm(this._filmData),
        {
          inHistory: !this._filmData.inHistory,
        },
      ),
    );
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();

    this._callback.watchlistClick(
      ActionTypes.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        CardView.parseDataToFilm(this._filmData),
        {
          inWatchlist: !this._filmData.inWatchlist,
        },
      ),
    );
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setTitleClickHandler(callback) {
    this._callback.titleClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._titleClickHandler);
  }

  setCommentClickHandler(callback) {
    this._callback.commentClick = callback;
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._commentClickHandler);
  }

  setPosterHandler(callback) {
    this._callback.posterClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._posterClickHandler);
  }

  getTemplate() {
    const {title, rating, date, duration, genres, poster, description, comments, inHistory, inFavorites, inWatchlist} = this._filmData;

    return (
      `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getYear(date)}</span>
          <span class="film-card__duration">${getDurationFormat(duration)}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${formatDescription(description)}</p>
        <a class="film-card__comments">${comments.length} ${comments.length > 1 || comments.length === 0 ? 'comments' : 'comment'}</a>
        ${createTypesTemplate(buttonType, this._data.isDisabled, {inHistory, inFavorites, inWatchlist})}
      </article>`
    );
  }
}
