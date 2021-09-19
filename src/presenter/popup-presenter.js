import { replace, render, remove } from '../utils/render';
import { Mode, RenderPosition } from '../const';
import PopupView from '../view/popup-view';
import { ActionTypes, UpdateType } from '../const';
import { State } from '../const';

const BODY_ELEMENT = document.body;

export default class PopupPresenter {
  constructor(changeData, commentsModel) {
    this._popupComponent = null;
    this._changeData = changeData;
    this._commentsModel = commentsModel;

    this._removePopup = this._removePopup.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._mode = Mode.DEFAULT;

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

  setViewState(state, commentId) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._popupComponent.updateData(
        PopupView.parseFilmToData(this._filmData),
        {
          isSaving: false,
          isDeleting: false,
          deletedCommentId: null,
        }, true);
    };

    switch (state) {
      case State.SAVING:
        this._popupComponent.updateData({
          isSaving: true,
        }, true);
        break;
      case State.DELETING:
        this._popupComponent.updateData({
          isDeleting: true,
          deletedCommentId: commentId,
        }, true);
        break;
      case State.ABORTING:
        this._popupComponent.shake(resetFormState);
        break;
    }
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

  openPopup() {
    BODY_ELEMENT.style.cursor = 'wait';
    this._commentsModel.getComments(this._filmData.id)
      .then((comments) => {
        this._filmData = Object.assign(
          {},
          this._filmData,
          {comments},
        );
        this.renderPopup();
      })
      .catch(() => {
        this._filmData = Object.assign(
          {},
          this._filmData,
          {isFaild: true},
        );
        this.renderPopup();
      });
  }

  renderPopup() {
    const oldPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(this._filmData);

    if (oldPopupComponent === null) {
      render(BODY_ELEMENT, this._popupComponent, RenderPosition.BEFOREEND);
      BODY_ELEMENT.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeydown);

    } else if (BODY_ELEMENT.contains(oldPopupComponent.getElement())) {
      replace(oldPopupComponent, this._popupComponent);
      remove(oldPopupComponent);
    }

    this._popupComponent.setCloseClickHandler(this._removePopup);
    this._popupComponent.setFavoriteClickHandler(this._changeData);
    this._popupComponent.setWatchedClickHandler(this._changeData);
    this._popupComponent.setWatchlistClickHandler(this._changeData);
    this._popupComponent.setCommentSubmitHandler(this._changeData);
    this._popupComponent.setCommentDeleteHandler(this._handleCommentDeletion);

    BODY_ELEMENT.style.cursor = 'default';
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
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      this._popupComponent.reset(this._filmData);
      this._removePopup();
      document.removeEventListener('keydown', this._onEscKeydown);
    }
  }
}
