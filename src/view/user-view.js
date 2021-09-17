import { getUserRank } from '../utils/utils';
import AbstractView from './abstract-view';

export default class UserRankView extends AbstractView {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${getUserRank(this._films)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }
}
