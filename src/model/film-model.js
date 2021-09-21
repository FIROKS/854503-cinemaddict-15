import { UpdateType } from '../const';
import Observer from '../utils/observer';

export default class FilmModel extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  get films() {
    return this._films;
  }

  set films(films) {
    this._films = films.slice();

    this._notify(UpdateType.INIT);
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, {comments, movie}) {
    const filmIndex = this._films.findIndex((film) => film.id === movie.id);
    const filmInModel = this._films[filmIndex];

    filmInModel.comments = comments;

    this._notify(updateType, filmInModel);
  }

  deleteComment(updateType, update) {
    this._notify(updateType, update);
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          actors: film.actors,
          'age_rating': film.ageRating,
          'alternative_title': film.originalTitle,
          description: film.description,
          director: film.director,
          genre: film.genres,
          poster: film.poster,
          release: {
            date: film.date,
            'release_country': film.country,
          },
          runtime: film.duration,
          title: film.title,
          'total_rating': film.rating,
          writers: film.writers,
        },
        'user_details': {
          'already_watched': film.inHistory,
          favorite: film.inFavorites,
          'watching_date': film.watchingDate,
          watchlist: film.inWatchlist,
        },
      },
    );

    delete(adaptedFilm.title);
    delete(adaptedFilm.originalTitle);
    delete(adaptedFilm.genres);
    delete(adaptedFilm.director);
    delete(adaptedFilm.writers);
    delete(adaptedFilm.actors);
    delete(adaptedFilm.country);
    delete(adaptedFilm.poster);
    delete(adaptedFilm.description);
    delete(adaptedFilm.rating);
    delete(adaptedFilm.ageRating);
    delete(adaptedFilm.date);
    delete(adaptedFilm.duration);
    delete(adaptedFilm.inWatchlist);
    delete(adaptedFilm.inHistory);
    delete(adaptedFilm.inFavorites);
    delete(adaptedFilm.watchingDate);
    delete(adaptedFilm.fetchedComments);

    return adaptedFilm;
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        title: film['film_info'].title,
        originalTitle: film['film_info']['alternative_title'],
        genres: film['film_info'].genre,
        director: film['film_info'].director,
        writers: film['film_info'].writers,
        actors: film['film_info'].actors,
        country: film['film_info'].release['release_country'],
        poster: film['film_info'].poster,
        description: film['film_info'].description,
        rating: film['film_info']['total_rating'],
        ageRating: film['film_info']['age_rating'],
        date: film['film_info'].release.date,
        duration: film['film_info'].runtime,
        inWatchlist: film['user_details']['watchlist'],
        inHistory: film['user_details']['already_watched'],
        inFavorites: film['user_details'].favorite,
        watchingDate: film['user_details']['watching_date'],
      },
    );

    delete(adaptedFilm['film_info']);
    delete(adaptedFilm['user_details']);

    return adaptedFilm;
  }
}
