import CommentView from './comment-view';
import { EMOTIONS } from '../const';
import { getFullDate } from '../utils/film';
import AbstractView from './abstract-view';

const buttonType = [
  ['watchlist', 'Add to watchlist', 'inWatchlist'],
  ['watched', 'Already watched', 'inHistory'],
  ['favorite', 'Add to favorites', 'inFavorites'],
];

const createEmojiTemplate = (emojiType) => (`
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiType}" value="${emojiType}">
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

export default class PopupView extends AbstractView {
  constructor (filmInfo = {}) {
    super();
    this._filmInfo = filmInfo;
    this._closeClickHandler = this._closeClickHandler.bind(this);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();

    this._callback.close();
  }

  setCloseClickHandler(callback) {
    this._callback.close = callback;
    this._element.querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  getTemplate() {
    const {title, originalTitle, genres, director, writers, actors, country, poster, description, comments, rating, ageRating, date, duration, commentsCount, inFavorites, inHistory, inWatchlist} = this._filmInfo;

    const detailsItems = [
      ['Director', director],
      ['Writers', writers],
      ['Actors', actors],
      ['Release Date', date],
      ['Runtime', duration],
      ['Country', country],
    ];

    return (
      `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

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

          <div class="film-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

              <ul class="film-details__comments-list">
                ${comments.map((comment) => new CommentView(comment).getTemplate()).join('')}
              </ul>

              <div class="film-details__new-comment">
                <div class="film-details__add-emoji-label"></div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  ${EMOTIONS.map((emotion) => createEmojiTemplate(emotion)).join('')}
                </div>
              </div>
            </section>
          </div>
        </form>
      </section>`
    );
  }
}
