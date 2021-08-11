import AbstractView from './abstract-view';

export default class ShowMoreView extends AbstractView {
  getTemplate() {
    return (
      '<button class="films-list__show-more">Show more</button>'
    );
  }
}
