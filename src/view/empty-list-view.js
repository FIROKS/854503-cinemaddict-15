import AbstractView from './abstract-view';

export default class emptyListView extends AbstractView {
  getTemplate() {
    return (
      '<h2 class="films-list__title">There are no movies in our database</h2>'
    );
  }
}
