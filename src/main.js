import Api from './api';
import FilmModel from './model/film-model';
import BoardPresenter from './presenter/board-presenter';

const ENDPOINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic hP3Up2A2H';

const api = new Api(ENDPOINT, AUTHORIZATION);
const filmModel = new FilmModel(api);
const boardPresenter = new BoardPresenter(filmModel, api);

boardPresenter.init();

api.getFilms()
  .then((films) => {
    filmModel.films = films;
  })
  .catch(() => {
    filmModel.films = [];
  });
