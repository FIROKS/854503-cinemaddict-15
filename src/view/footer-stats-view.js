import AbstractView from './abstract-view';

export default class FooterStatsView extends AbstractView {
  getTemplate() {
    return (
      `<section class="footer__statistics">
        <p>130 291 movies inside</p>
      </section>`
    );
  }
}
