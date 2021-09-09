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
  const resultHours = films.reduce((sum, film) => sum + dayjs(film.duration).hour(), 0);
  const resultMinutes = films.reduce((sum, film) => sum + dayjs(film.duration).minute(), 0);

  return {
    hours: resultHours,
    minutes: resultMinutes,
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
      return films.filter((film) => dayjs(film.watchingDate).isBefore(dateFrom));
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
