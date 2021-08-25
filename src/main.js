
import {createFilmMock} from './mock/film-mock';
import {createFiltersMock} from './mock/filters-mock';
import ExtraListPresenter from './presenter/extra-list-presenter';
import FilmListPresenter from './presenter/list-presenter';
import { sortMostComment, sortTopRated } from './utils/utils'


const FILMS_AMOUNT = 17;

const filmMocks = new Array(FILMS_AMOUNT).fill().map(() => createFilmMock());

const topRatedFilms = filmMocks.slice().sort(sortTopRated);
const mostCommentedFilms = filmMocks.slice().sort(sortMostComment);

const filterMocks = createFiltersMock(filmMocks);

const filmsContainerElement = document.querySelector('.films');

const topRatedPresenter = new ExtraListPresenter(filmsContainerElement);
const mostCommentedPresenter = new ExtraListPresenter(filmsContainerElement);

topRatedPresenter.init('Top rated', topRatedFilms);
mostCommentedPresenter.init('Most commented', mostCommentedFilms);

const filmListPresenter = new FilmListPresenter(filmsContainerElement, topRatedPresenter, mostCommentedPresenter);

filmListPresenter.init(filmMocks, filterMocks);
