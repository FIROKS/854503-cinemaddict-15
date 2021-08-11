import { getYear } from '../utils/utils';
import AbstractView from './abstract-view';

const buttonType = [
  ['add-to-watchlist', 'Add to watchlist'],
  ['mark-as-watched', 'Mark as watched'],
  ['favorite', 'Mark as favorite'],
];

const formatDescription = (text) => {
  let formatedText = text;
  if (formatedText.length > 140) {
    formatedText = `${formatedText.slice(0, 139)}…`;
  }

  return formatedText;
};

const createTypesTemplate = (types) => {
  const createTypeTemplate = ([buttonClass, buttonText]) => (`
  <button class="film-card__controls-item film-card__controls-item--${buttonClass}" type="button">${buttonText}</button>
  `);

  return (`
  <div class="film-card__controls">
    ${types.map((type) => createTypeTemplate(type)).join('')}
  </div>
  `);
};

export default class CardView extends AbstractView {
  constructor(filmInfo) {
    super();
    this._filmInfo = filmInfo;
  }

  getTemplate() {
    const {title, rating, date, duration, genres, poster, description, commentsCount} = this._filmInfo;

    return (
      `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getYear(date)}</span>
          <span class="film-card__duration">${duration}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="./images/posters/${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${formatDescription(description)}</p>
        <a class="film-card__comments">${commentsCount} ${commentsCount > 1 ? 'comments' : 'comment'}</a>
        ${createTypesTemplate(buttonType)}
      </article>`
    );
  }
}
