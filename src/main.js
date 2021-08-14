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
import { render, remove, replace } from './utils/render';
import { RenderPosition } from './const';

const CARD_PER_STEP = 5;
const FILMS_AMOUNT = 17;

const BODY_ELEMENT = document.body;
const filmMocks = new Array(FILMS_AMOUNT).fill().map(() => createFilmMock());

const filterMocks = createFiltersMock(filmMocks);

const renderCard = (container, filmInfo) => {
  const cardInstance = new CardView(filmInfo);
  const popupInstance = new PopupView(filmInfo);

  render(container, cardInstance, RenderPosition.BEFOREEND);

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
    const oldPopupElement = BODY_ELEMENT.querySelector('.film-details');

    if (oldPopupElement) {
      replace(oldPopupElement, popupInstance);
    } else {
      render(BODY_ELEMENT, popupInstance, RenderPosition.BEFOREEND);
    }

    BODY_ELEMENT.classList.add('hide-overflow');

    popupInstance.setCloseClickHandler(removePopup);
    document.addEventListener('keydown', onEscKeydown);
  };

  cardInstance.setCommentClickHandler(showPopup);
  cardInstance.setTitleClickHandler(showPopup);
  cardInstance.setPosterHandler(showPopup);
};

const renderList = () => {
  const headerElement = document.querySelector('.header');
  const mainElement = document.querySelector('.main');
  const footerElement = document.querySelector('.footer');
  const sortInstance = new SortView();

  render(headerElement, new UseRankView(), 'beforeend');
  render(footerElement, new FooterStatsView(), 'beforeend');

  render(mainElement, new FilmsView(), 'afterbegin');
  render(mainElement, sortInstance, 'afterbegin');
  render(mainElement, new MenuView(), 'afterbegin');

  const filmListContainerElement = mainElement.querySelector('.films-list__container');
  const filmListElement = mainElement.querySelector('.films-list');
  const filmsElement = mainElement.querySelector('.films');
  const navElement = mainElement.querySelector('.main-navigation');

  render(navElement, new FiltersView(filterMocks), 'afterbegin');

  if (filmMocks.length === 0) {
    render(filmListContainerElement, new EmptyListView(), 'afterbegin');
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

      showMoreButton.setClickHandler(() => {
        filmMocks
          .slice(renderedCards, renderedCards + CARD_PER_STEP)
          .map((filmMock) => {renderCard(filmListContainerElement, filmMock, 'beforeend');});

        renderedCards += CARD_PER_STEP;

        if (renderedCards >= filmMocks.length) {
          showMoreButton.removeElement();
          remove(showMoreButtonElement);
        }
      });
    }
  };

  const renderExtra = () => {
    render(filmsElement, new ExtraView('Top rated'), 'beforeend');
    render(filmsElement, new ExtraView('Most commented'), 'beforeend');

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
