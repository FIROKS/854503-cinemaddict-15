import AbstractView from './abstract-view';
import he from 'he';
export default class CommentView extends AbstractView {
  constructor(commentInfo)  {
    super();
    this._commentInfo = commentInfo;
  }

  getTemplate() {
    const {id, date, author, comment, emotion} = this._commentInfo;

    return (
      `<li class="film-details__comment" data-id="${id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(comment)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${date}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
    );
  }
}
