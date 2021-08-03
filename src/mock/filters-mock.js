const getFiltersCount = {
  watchlist: (films) => films.filter((film) => film.inWatchlist).length,
  history: (films) => films.filter((film) => film.inHistory).length,
  favorites: (films) => films.filter((film) => film.inFavorites).length,
};

export const generateFilter = (films) => Object.entries(getFiltersCount).map(
  ([filterName, filterCount]) => ({
    name: filterName,
    count: filterCount(films),
  }),
);
