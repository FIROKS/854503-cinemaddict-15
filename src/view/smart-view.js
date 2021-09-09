import { replace } from '../utils/render';
import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  constructor() {
    super();

    this._data = {};
  }

  updateData(update, updateElement = false) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (updateElement) {
      this.updateElement();
    }
  }

  updateElement() {
    const prevElement = this.getElement();
    this._scrollPosition = prevElement.scrollTop;

    this.removeElement();

    const newElement = this.getElement();
    replace(prevElement, newElement);
    newElement.scrollTop = this._scrollPosition;
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
