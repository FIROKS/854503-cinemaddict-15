import CommentView from './comment-view';
import { EMOTIONS, UpdateType, ActionTypes} from '../const';
import { getDurationFormat, getFullDate } from '../utils/film';
import SmartView from './smart-view';
import LoadingView from './loading-view';

const buttonType = [
  ['watchlist', 'Add to watchlist', 'inWatchlist'],
  ['watched', 'Already watched', 'inHistory'],
  ['favorite', 'Add to favorites', 'inFavorites'],
];

const createEmojiTemplate = (emojiType, selectedEmotion, isSaving) => (`
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiType}" value="${emojiType}" ${emojiType === selectedEmotion ? 'checked' : ''} ${isSaving ? 'disabled' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emojiType}">
    <img src="./images/emoji/${emojiType}.png" width="30" height="30" alt="emoji">
  </label>
`);

const createDetailsRowTemplate = (detail) => {
  const [detailName, detailContent] = detail;
  let detailText;

  if (detailContent instanceof Date) {
    detailText = getFullDate(detailContent);
  } else {
    detailText = typeof detailContent === 'string' ? detailContent : detailContent.join(', ');
  }

  return (`
    <tr class="film-details__row">
      <td class="film-details__term">${detailName}</td>
      <td class="film-details__cell">${detailText}</td>
    </tr>
  `);
};

const createGenresTemplate = (genres) => {
  const createGenreTemplate = (genre) => (`
  <span class="film-details__genre">${genre}</span>
  `);

  return (`
    <td class="film-details__term">Genres</td>
    <td class="film-details__cell">
      ${genres.map((genre) => createGenreTemplate(genre)).join('')}
    </td>
  `);
};

const createTypesTemplate = (types, filmData) => {
  const createTypeTemplate = ([typeName, typeText, buttonProp]) => (`
  <button type="button" class="film-details__control-button film-details__control-button--${typeName} ${filmData[buttonProp] ? 'film-details__control-button--active' : ''}" id="${typeName}" name="${typeName}">${typeText}</button>
  `);

  return (`
    <section class="film-details__controls">
      ${types.map((type) => createTypeTemplate(type)).join('')}
    </section>
  `);
};

const createCommentsTemplate = (comments, commentsCount = 0, isDeleting, deletedCommentId) => {
  if (comments && commentsCount !== 0) {
    return (
      `<ul class="film-details__comments-list">
        ${comments.map((comment) => new CommentView(comment, isDeleting, deletedCommentId).getTemplate()).join('')}
      </ul>`
    );
  }
  return '';
};

const createEmojiImgTemplate = (emotion) => {
  if (!emotion) {
    return '';
  }
  return `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`;
};

export default class PopupView extends SmartView {
  constructor (filmInfo = {}) {
    super();
    this._data = PopupView.parseFilmToData(filmInfo);

    this._loadingComponent = new LoadingView();
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._textInputHandler = this._textInputHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._scrollPosition = null;

    this._setInnerHandlers();
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.commentsCount;
    delete data.newComment;
    delete data.selectedEmotion;
    delete data.commentText;
    delete data.isFaild;
    delete data.isSaving;
    delete data.isDeleting;
    delete data.deletedCommentId;

    return data;
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        commentsCount: film.comments.length,
        newComment: {},
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  reset(film) {
    this.updateData(PopupView.parseFilmToData(film), true);
  }

  restoreHandlers() {
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setCloseClickHandler(this._callback.close);
    this.setCommentSubmitHandler(this._callback.submit);
    if (!this._data.isFaild) {
      this.setCommentDeleteHandler(this._callback.commentDelete);
    }
    this._setInnerHandlers();
  }

  _handleCommentsRender(fetchComments) {
    const comments = fetchComments();

    this.updateData({comments}, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
    this.getElement().querySelector('#watched').addEventListener('click', this._watchedClickHandler);
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistClickHandler);
    if (!this._data.isFaild) {
      this._emojiListElement = this.getElement().querySelector('.film-details__emoji-list');
      this._emojiListElement.addEventListener('change', this._emojiClickHandler);
      this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._textInputHandler);
    }
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      selectedEmotion: evt.target.value,
    }, true);
  }

  _textInputHandler(evt) {
    this.updateData({commentText: evt.target.value});
  }

  _commentSubmitHandler(evt) {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();

      if (this._data.selectedEmotion && this._data.commentText) {
        this._data.newComment = {
          id: null,
          author: null,
          comment: this._data.commentText,
          date: null,
          emotion: this._data.selectedEmotion,
        };
        this._callback.submit(
          ActionTypes.ADD_COMMENT,
          UpdateType.MINOR,
          [PopupView.parseDataToFilm(this._data), this._data.newComment]);

        document.removeEventListener('keydown', this._commentSubmitHandler);
      }
    }
  }

  _handleCommentDelete(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    this._callback.commentDelete(evt, this._data);
  }

  setCommentDeleteHandler(callback) {
    this._callback.commentDelete = callback;

    if (!this._data.isFaild) {
      this.getElement().querySelector('.film-details__comments-wrap').addEventListener('click', this._handleCommentDelete);
    }
  }

  setCommentSubmitHandler(callback) {
    this._callback.submit = callback;

    if (!this._data.isFaild) {
      document.addEventListener('keydown', this._commentSubmitHandler);
    }
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();

    this.updateData({inFavorites: !this._data.inFavorites});
    this._callback.favoriteClick(
      ActionTypes.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        PopupView.parseDataToFilm(this._data),
      ),
    );
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();

    this.updateData({inHistory: !this._data.inHistory});
    this._callback.watchedClick(
      ActionTypes.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        PopupView.parseDataToFilm(this._data),
      ),
    );
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();

    this.updateData({inWatchlist: !this._data.inWatchlist});
    this._callback.watchlistClick(
      ActionTypes.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        PopupView.parseDataToFilm(this._data),
      ),
    );
  }

  _closeClickHandler(evt) {
    evt.preventDefault();

    this._callback.close();
  }

  setCloseClickHandler(callback) {
    this._callback.close = callback;
    this._element.querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  _createLoadingTemplate() {
    return this._loadingComponent.getTemplate();
  }

  getTemplate() {
    const {title, originalTitle, genres, director, writers, actors, country, poster, description, rating, ageRating, date, duration, fetchedComments, commentsCount, inFavorites, inHistory, inWatchlist, isSaving, isDeleting, deletedCommentId} = this._data;

    const detailsItems = [
      ['Director', director],
      ['Writers', writers],
      ['Actors', actors],
      ['Release Date', date],
      ['Runtime', getDurationFormat(duration)],
      ['Country', country],
    ];

    return (
      `<section class="film-details">
        <form class="film-details__inner" action="" method="get" ${isSaving ? 'disabled' : ''}>
          <div class="film-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="${poster}" alt="">

                <p class="film-details__age">${ageRating}</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${title}</h3>
                    <p class="film-details__title-original">Original: ${originalTitle}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${rating}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  ${detailsItems.map((detail) => createDetailsRowTemplate(detail)).join('')}
                  <tr class="film-details__row">
                    ${createGenresTemplate(genres)}
                  </tr>
                </table>

                <p class="film-details__film-description">
                  ${description}
                </p>
              </div>
            </div>
            ${createTypesTemplate(buttonType, {inFavorites, inHistory, inWatchlist})}
          </div>

          ${!this._data.isFaild ? `<div class="film-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

              ${createCommentsTemplate(fetchedComments, commentsCount, isDeleting, deletedCommentId)}

              <div class="film-details__new-comment">
                <div class="film-details__add-emoji-label">${createEmojiImgTemplate(this._data.selectedEmotion)}</div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSaving ? 'disabled' : ''}>${this._data.commentText ? this._data.commentText : ''}</textarea>
                </label>

                <div class="film-details__emoji-list">
                  ${EMOTIONS.map((emotion) => createEmojiTemplate(emotion, this._data.selectedEmotion, isSaving)).join('')}
                </div>
              </div>
            </section>
          </div>` : ''}
        </form>
      </section>`
    );
  }
}
