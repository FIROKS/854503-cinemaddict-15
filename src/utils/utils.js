import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomNumber = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

export const capitalizeFirstLetter = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const sortByCommentsAmount = (filmA, filmB) => {
  const commentCountA = filmA.comments.length;
  const commentCountB = filmB.comments.length;
  if (commentCountA > commentCountB) {
    return -1;
  }

  if (commentCountA < commentCountB) {
    return 1;
  }

  return 0;
};

export const sortByRating = (filmA, filmB) => {
  if (filmA.rating > filmB.rating) {
    return -1;
  }

  if (filmA.rating < filmB.rating) {
    return 1;
  }

  return 0;
};

export const sortByDate = (filmA, filmB) => {
  if (dayjs(filmA.date).isAfter(filmB.date)) {
    return -1;
  }

  if (dayjs(filmA.date).isBefore(filmB.date)) {
    return 1;
  }

  return 0;
};

export const findIndex = (data, value, prop) => data.findIndex((item) => item[prop] === value);

export const getUserRank = (films) => {
  const filmsInHistory = films.filter((film) => film.inHistory === true).length;

  if (filmsInHistory >= 1 && filmsInHistory <= 10) {
    return 'Novice';
  }
  if (filmsInHistory >= 11 && filmsInHistory <= 20) {
    return 'Fan';
  }
  if (filmsInHistory >= 21) {
    return 'Movie Buff';
  }

  return '';
};
