import AbstractView from './abstract-view';

export default class FooterStatsView extends AbstractView {
  constructor(filmsAmount) {
    super();
    this._filmsAmount = filmsAmount;
  }

  getTemplate() {
    return (
      `<section class="footer__statistics">
        <p>${this._filmsAmount} movies inside</p>
      </section>`
    );
  }
}
