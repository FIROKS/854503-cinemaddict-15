import dayjs from 'dayjs';

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
