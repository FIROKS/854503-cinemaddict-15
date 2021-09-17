import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { GENRES, StatsFilters } from '../const';

dayjs.extend(isBetween);

const genreCount = (films, genre) => {
  const genreAmount = films.filter((film) => film.genres.findIndex((currentGenre) => currentGenre === genre)).length;

  return genreAmount;
};

export const genresCount = (films) => {
  const genresAmount = [
    genreCount(films, 'Sci-Fi'),
    genreCount(films, 'Animation'),
    genreCount(films, 'Fantasy'),
    genreCount(films, 'Comedy'),
    genreCount(films, 'TV Series'),
  ];

  return genresAmount;
};

export const totalDuration = (films) => {
  const result = films.reduce((sum, film) => sum + dayjs(film.duration), 0);
  const hours = Math.floor(result / 60);
  const minutes = Math.round(result - hours * 60);
  return {
    hours,
    minutes,
  };
};

export const topGenre = (films) => {
  const result = genresCount(films);
  const maxAmount = Math.max(...result);
  const resultIndex = result.findIndex((genre) => genre === maxAmount);

  return GENRES[resultIndex];
};

export const watchedCount = (films) => films.filter((film) => film.inHistory).length;

export const filmsFromPeriod = (films, dateFrom, dateTo) => {
  if (!dateTo) {
    return [];
  }

  switch (dateTo) {
    case StatsFilters.TODAY: {
      return films.filter((film) => dayjs(film.watchingDate).isSame(dayjs(), 'day'));
    }
    case StatsFilters.ALL_TIME: {
      return films;
    }
    default: {
      dateTo = dayjs().subtract(1, dateTo);

      return films.filter((film) => dayjs(film.watchingDate).isBetween(dateFrom, dateTo));
    }
  }
};
