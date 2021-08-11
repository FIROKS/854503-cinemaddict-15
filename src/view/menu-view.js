import AbstractView from './abstract-view';

export default class MenuView extends AbstractView {
  getTemplate() {
    return (
      `<nav class="main-navigation">
        <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`
    );
  }
}
