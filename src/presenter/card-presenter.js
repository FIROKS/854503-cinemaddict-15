import { render, remove, replace } from '../utils/render';
import { RenderPosition, Mode } from '../const';
import CardView from '../view/card-view';
import { State } from '../const';

export default class FilmPresenter {
  constructor(container, changeData, popupComponent) {
    this._container = container;
    this._changeData = changeData;
    this._popupComponent = popupComponent;
    this._mode = Mode.DEFAULT;

    this._filmComponent = null;

    this._handlePopup = this._handlePopup.bind(this);
  }

  _handlePopup() {
    this._popupComponent.init(this._filmData);
    this._popupComponent.openPopup();
  }

  init(filmData) {
    this._filmData = filmData;

    const prevComponent = this._filmComponent;

    this._filmComponent = new CardView(filmData, this._changeData);

    this._filmComponent.setCommentClickHandler(this._handlePopup);
    this._filmComponent.setTitleClickHandler(this._handlePopup);
    this._filmComponent.setPosterHandler(this._handlePopup);
    this._filmComponent.setFavoriteClickHandler(this._changeData);
    this._filmComponent.setWatchedClickHandler(this._changeData);
    this._filmComponent.setWatchlistClickHandler(this._changeData);

    if (prevComponent === null) {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._container.contains(prevComponent.getElement())) {
      replace(prevComponent, this._filmComponent);
    }

    remove(prevComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._filmComponent.updateData({
        isDisabled: false,
      }, true);
    };

    switch (state) {
      case State.ABORTING: {
        this._filmComponent.shake(resetFormState);
        break;
      }
      case State.UPDATING: {
        this._filmComponent.updateData({isDisabled: true}, true);
        break;
      }
    }
  }

  destroy() {
    remove(this._filmComponent);
  }
}
