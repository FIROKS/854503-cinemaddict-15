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
}
