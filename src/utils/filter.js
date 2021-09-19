export const filter = {
  all: (films) => films,
  watchlist: (films) => films.filter((film) => film.inWatchlist),
  history: (films) => films.filter((film) => film.inHistory),
  favorites: (films) => films.filter((film) => film.inFavorites),
};
