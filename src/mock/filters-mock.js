const getFiltersCount = {
  watchlist: (films) => films.filter((film) => film.inWatchlist).length,
  history: (films) => films.filter((film) => film.inHistory).length,
  favorites: (films) => films.filter((film) => film.inFavorites).length,
};

export const createFiltersMock = (films) => Object.entries(getFiltersCount).map(
  ([filterName, filterCount]) => ({
    name: filterName,
    count: filterCount(films),
  }),
);
