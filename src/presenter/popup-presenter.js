import { replace, render, remove } from '../utils/render';
import { Mode, RenderPosition } from '../const';
import PopupView from '../view/popup-view';
import { ActionTypes, UpdateType } from '../const';

const BODY_ELEMENT = document.body;

export default class PopupPresenter {
  constructor(changeData, api) {
    this._popupComponent = null;
    this._changeData = changeData;
    this._api = api;

    this._removePopup = this._removePopup.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._mode = Mode.DEFAULT;
    // this._scrollPosition = null;

    this._handleCommentsFetch = this._handleCommentsFetch.bind(this);
    this._handleCommentDeletion = this._handleCommentDeletion.bind(this);
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

  _handleCommentsFetch() {
    return new Promise((resolve) => {
      const comments = this._api.getComments(this._filmData.id);
      resolve(comments);
    });
  }

  _handleCommentDeletion(evt, filmData) {
    const commentId = evt.target.closest('.film-details__comment').dataset.id;
    const updatedFilmData = Object.assign(
      {},
      filmData,
    );
    updatedFilmData.comments = updatedFilmData.comments.filter((comment) => comment !== commentId);

    this._changeData(
      ActionTypes.DELETE_COMMENT,
      UpdateType.MINOR,
      {
        film: PopupView.parseDataToFilm(updatedFilmData),
        commentId,
      },
    );

  }

  updateView() {
    this._popupComponent.updateData(PopupView.parseFilmToData(this._filmData), true);
  }

  renderPopup() {
    const oldPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(this._filmData, this._handleCommentsFetch);

    if (oldPopupComponent === null) {
      render(BODY_ELEMENT, this._popupComponent, RenderPosition.BEFOREEND);
      BODY_ELEMENT.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeydown);

    } else if (BODY_ELEMENT.contains(oldPopupComponent.getElement())) {
      // this._scrollPosition = oldPopupComponent.getElement().scrollTop;
      replace(oldPopupComponent, this._popupComponent);
      // this._popupComponent.getElement().scrollTop = this._scrollPosition;
      remove(oldPopupComponent);
    }

    this._popupComponent.setCloseClickHandler(this._removePopup);
    this._popupComponent.setFavoriteClickHandler(this._changeData);
    this._popupComponent.setWatchedClickHandler(this._changeData);
    this._popupComponent.setWatchlistClickHandler(this._changeData);
    this._popupComponent.setCommentSubmitHandler(this._changeData);
    this._popupComponent.setCommentDeleteHandler(this._handleCommentDeletion);
    this._mode = Mode.DETAILS;
  }

  _removePopup() {
    if (this._popupComponent) {
      // this._popupComponent.reset(this._filmData);
      remove(this._popupComponent);
      this._popupComponent = null;
      this._mode = Mode.DEFAULT;
      BODY_ELEMENT.classList.remove('hide-overflow');
    }
  }

  _onEscKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      this._popupComponent.reset(this._filmData);
      this._removePopup();
      document.removeEventListener('keydown', this._onEscKeydown);
    }
  }
}
