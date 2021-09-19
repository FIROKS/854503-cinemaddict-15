import AbstractView from './abstract-view';

export default class ShowMoreView extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this._element.addEventListener('click', this._clickHandler);
  }

  getTemplate() {
    return (
      '<button class="films-list__show-more">Show more</button>'
    );
  }
}
