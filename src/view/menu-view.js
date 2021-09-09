import AbstractView from './abstract-view';

export default class MenuView extends AbstractView {
  constructor() {
    super();

    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();

    this._callback.statsClick();
    // this.getElement().querySelector('.main-navigation__item--active').classList.toggle('main-navigation__item--active');
    // main-navigation__item--active
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._statsClickHandler);
  }

  getTemplate() {
    return (
      `<nav class="main-navigation">
        <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`
    );
  }
}
