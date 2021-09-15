import AbstractView from './abstract-view';

export default class LoadingView extends AbstractView {
  getTemplate() {
    return (
      '<h2 class="films-list__title">Loading...</h2>'
    );
  }
}
