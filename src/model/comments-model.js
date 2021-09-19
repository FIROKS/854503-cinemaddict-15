import Observer from '../utils/observer';

export default class CommentsModel extends Observer {
  constructor(api) {
    super();

    this._comments = {};
    this._api = api;
  }

  getComments(filmId) {
    if (this._comments[filmId]) {
      return Promise.resolve(this._comments[filmId]);
    } else {
      return new Promise((resolve) => {
        // this._comments[filmId] = this._api.getComments(filmId);
        // resolve(this._comments[filmId]);
        this._api.getComments(filmId)
          .then((comments) => {
            this._comments[filmId] = comments;
            resolve(this._comments[filmId]);
          });
      });
    }
  }

  setComments(filmdId, comments) {
    this._comments[filmdId] = comments;
  }

  addComment(updateType, {movie: film, comments}) {
    const filmId = film.id;
    this._comments[filmId] = comments;

    this._notify(updateType, film);
  }

  deleteComment(updateType, [film, commentId]) {
    const filmId = film.id;
    const filteredComments = this._comments[filmId].filter((comment) => comment.id !== commentId);

    this._comments.filmId = filteredComments;

    this._notify(updateType, filteredComments);
  }

  static adaptToServer(comments) {
    const adaptedComments = comments.map((comment) => comment = comment.id);
    return adaptedComments;
  }
}
