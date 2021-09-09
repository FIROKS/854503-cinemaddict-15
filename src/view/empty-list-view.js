import AbstractView from './abstract-view';

const emptyListTexts = new Map([
  ['all', 'There are no movies in our database'],
  ['watchlist', 'There are no movies to watch now'],
  ['history', 'There are no watched movies now'],
  ['favorites', 'There are no favorite movies now'],
]);
export default class EmptyListView extends AbstractView {
  constructor(text = 'all') {
    super();
    this._text = text;
  }

  getTemplate() {
    return (
      `<h2 class="films-list__title">${emptyListTexts.get(this._text)}</h2>`
    );
  }
}
