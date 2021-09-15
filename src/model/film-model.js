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

  updatefilm(updateType, update) {
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

  addComment(updateType, update, newComment) {
    const filmIndex = this._films.findIndex((film) => film.id === update.id);
    const updatedFilm = this._films[filmIndex];

    updatedFilm.comments.push(newComment);

    this.updatefilms(updateType, update);
  }

  deleteComment(updateType, [commentId, filmData]) {
    const filmIndex = this._films.findIndex((film) => film.id === filmData.id);
    const updatedFilm = this._films[filmIndex];
    const commentIndex = updatedFilm.comments.findIndex((comment) => comment.id === commentId);

    if (filmIndex === -1) {
      throw new Error('Unexisting film');
    }
    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    updatedFilm.comments = [
      ...this._films[filmIndex].comments.slice(0, commentIndex),
      ...this._films[filmIndex].comments.slice(commentIndex + 1),
    ];

    this.updatefilm(updateType, updatedFilm);
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
          writers: film.rating,
        },
        'user_details': {
          'already_watched': film.inHistory,
          favorite: film.inFavorites,
          'watching_date': film.watchingDate,
          watchlist: film.inWatchlist,
        },
      },
    );

    delete(film.title);
    delete(film.originalTitle);
    delete(film.genres);
    delete(film.director);
    delete(film.writers);
    delete(film.actors);
    delete(film.country);
    delete(film.poster);
    delete(film.description);
    delete(film.rating);
    delete(film.ageRating);
    delete(film.date);
    delete(film.duration);
    delete(film.inWatchlist);
    delete(film.inHistory);
    delete(film.inFavorites);
    delete(film.watchingDate);

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
