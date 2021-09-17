import AbstractView from './abstract-view';
import he from 'he';

const createButtonTemplate = (id, isDeleting, deletedCommentId) => {
  if (!isDeleting) {
    return ('<button class="film-details__comment-delete">Delete</button>');
  }

  const isEqual = id === deletedCommentId;

  return (`<button class="film-details__comment-delete" ${isEqual ? 'disabled' : ''}>${isEqual ? 'Deleting' : 'Delete'}</button>`);

};

export default class CommentView extends AbstractView {
  constructor(commentInfo, isDeleting, deletedCommentId)  {
    super();
    this._commentInfo = commentInfo;
    this.isDeleting = isDeleting;
    this.deletedCommentId = deletedCommentId;
  }

  getTemplate() {
    const {id, date, author, comment, emotion} = this._commentInfo;

    return (
      `<li class="film-details__comment" data-id="${id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment ? he.encode(comment) : ''}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${date}</span>
            ${createButtonTemplate(id, this.isDeleting, this.deletedCommentId)}
          </p>
        </div>
      </li>`
    );
  }
}
