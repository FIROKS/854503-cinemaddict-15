import { getYear } from '../utils/utils';

const formatDescription = (text) => {
  let formatedText = text;
  if (formatedText.length > 140) {
    formatedText = `${formatedText.slice(0, 139)}…`;
  }

  return formatedText;
};

export const createCardTemplate = (filmInfo) => {
  const {title, rating, date, duration, genres, poster, description, commentsCount} = filmInfo;

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
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};
