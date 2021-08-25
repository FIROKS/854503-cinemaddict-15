import { replace, render, remove } from '../utils/render';
import { Mode, RenderPosition } from '../const';
import PopupView from '../view/popup-view';

const BODY_ELEMENT = document.body;

export default class PopupPresenter {
  constructor() {
    this._popupComponent = null;

    this._removePopup = this._removePopup.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._mode = Mode.DEFAULT;
  }

  init(filmData) {
    this._filmData = Object.assign(
      {},
      filmData,
    );
  }

  get mode() {
    return this._mode;
  }

  _renderPopup() {
    const oldPopupElement = this._popupComponent;
    this._popupComponent = new PopupView(this._filmData);

    if (oldPopupElement === null) {
      render(BODY_ELEMENT, this._popupComponent, RenderPosition.BEFOREEND);
      BODY_ELEMENT.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeydown);

    } else if (BODY_ELEMENT.contains(oldPopupElement.getElement())) {
      replace(oldPopupElement, this._popupComponent);
      remove(oldPopupElement);
    }

    this._popupComponent.setCloseClickHandler(this._removePopup);
    this._mode = Mode.DETAILS;
  }

  _removePopup() {
    if (this._popupComponent) {
      remove(this._popupComponent);
      this._popupComponent = null;
      this._mode = Mode.DEFAULT;
      BODY_ELEMENT.classList.remove('hide-overflow');
    }
  }
    
  _onEscKeydown(evt) {
    evt.preventDefault();

    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._removePopup();
      document.removeEventListener('keydown', this._onEscKeydown);
    }
  }
}