import PopupView from './view/popup-view';
import CardView from './view/card-view';
import ShowMoreView from './view/show-more-view';
import MenuView from './view/menu-view';
import UseRankView from './view/user-view';
import SortView from './view/sort-view';
import FilmsView from './view/films-view';
import ExtraView from './view/extra-view';
import FooterStatsView from './view/footer-stats-view';
import {createFilmMock} from './mock/film-mock';
import {createFiltersMock} from './mock/filters-mock';
import FiltersView from './view/filters-view';
import EmptyListView from './view/empty-list-view';
import { render } from './utils/utils';
import { RenderPosition } from './const';

const CARD_PER_STEP = 5;
const FILMS_AMOUNT = 17;

const BODY_ELEMENT = document.body;
const filmMocks = new Array(FILMS_AMOUNT).fill().map(() => createFilmMock());

const filterMocks = createFiltersMock(filmMocks);

const renderCard = (container, filmInfo) => {
  const cardInstance = new CardView(filmInfo);
  const cardElement = cardInstance.getElement();
  const popupInstance = new PopupView(filmInfo);

  render(container, cardElement, RenderPosition.BEFOREEND);

  const removePopup = () => {
    const popupElement = popupInstance.getElement();

    if (popupElement) {
      popupElement.remove();
      BODY_ELEMENT.classList.remove('hide-overflow');
    }
  };

  const onEscKeydown = (evt) => {
    evt.preventDefault();

    if (evt.key === 'Escape' || evt.key === 'Esc') {
      removePopup();
      document.removeEventListener('keydown', onEscKeydown);
    }
  };

  const showPopup = () => {
    const closeButtonElement = popupInstance.getElement().querySelector('.film-details__close-btn');
    const oldPopupElement = BODY_ELEMENT.querySelector('.film-details');

    if (oldPopupElement) {
      BODY_ELEMENT.replaceChild(popupInstance.getElement(), oldPopupElement);
    } else {
      render(BODY_ELEMENT, popupInstance.getElement(), RenderPosition.BEFOREEND);
    }

    BODY_ELEMENT.classList.add('hide-overflow');

    closeButtonElement.addEventListener('click', removePopup);
    document.addEventListener('keydown', onEscKeydown);
  };

  cardElement.querySelector('.film-card__title').addEventListener('click', () => showPopup(filmInfo));
  cardElement.querySelector('.film-card__poster').addEventListener('click', () => showPopup(filmInfo));
  cardElement.querySelector('.film-card__comments').addEventListener('click', () => showPopup(filmInfo));
};

const renderList = () => {
  const headerElement = document.querySelector('.header');
  const mainElement = document.querySelector('.main');
  const footerElement = document.querySelector('.footer');
  const sortInstance = new SortView();

  render(headerElement, new UseRankView().getElement(), 'beforeend');
  render(footerElement, new FooterStatsView().getElement(), 'beforeend');

  render(mainElement, new FilmsView().getElement(), 'afterbegin');
  render(mainElement, sortInstance.getElement(), 'afterbegin');
  render(mainElement, new MenuView().getElement(), 'afterbegin');

  const filmListContainerElement = mainElement.querySelector('.films-list__container');
  const filmListElement = mainElement.querySelector('.films-list');
  const filmsElement = mainElement.querySelector('.films');
  const navElement = mainElement.querySelector('.main-navigation');

  render(navElement, new FiltersView(filterMocks).getElement(), 'afterbegin');

  if (filmMocks.length === 0) {
    render(filmListContainerElement, new EmptyListView().getElement(), 'afterbegin');
    sortInstance.getElement().remove();
    return;
  }

  const renderCards = () => {
    for (let i = 0; i < Math.min(filmMocks.length, CARD_PER_STEP); i++) {
      renderCard(filmListContainerElement, filmMocks[i]);
    }

    if (filmMocks.length > CARD_PER_STEP) {
      const showMoreButton = new ShowMoreView();
      let renderedCards = CARD_PER_STEP;

      render(filmListElement, showMoreButton.getElement(), 'beforeend');

      const showMoreButtonElement = filmListElement.querySelector('.films-list__show-more');

      showMoreButtonElement.addEventListener('click', () => {
        filmMocks
          .slice(renderedCards, renderedCards + CARD_PER_STEP)
          .map((filmMock) => {renderCard(filmListContainerElement, filmMock, 'beforeend');});

        renderedCards += CARD_PER_STEP;

        if (renderedCards >= filmMocks.length) {
          showMoreButton.removeElement();
          showMoreButtonElement.remove();
        }
      });
    }
  };

  const renderExtra = () => {
    render(filmsElement, new ExtraView('Top rated').getElement(), 'beforeend');
    render(filmsElement, new ExtraView('Most commented').getElement(), 'beforeend');

    const extraElements = mainElement.querySelectorAll('.films-list.films-list--extra');

    for (const elem of extraElements) {
      const listElement = elem.querySelector('.films-list__container');

      for (let i = 0; i < 2; i++) {
        renderCard(listElement, filmMocks[i]);
      }
    }
  };

  renderCards();
  renderExtra();
};

renderList();
