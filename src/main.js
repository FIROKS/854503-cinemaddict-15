import Api from './api';
import FilmModel from './model/film-model';
import BoardPresenter from './presenter/board-presenter';

const ENDPOINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic hP3Up2A2H';

const api = new Api(ENDPOINT, AUTHORIZATION);
const filmModel = new FilmModel(api);
const boardPresenter = new BoardPresenter(filmModel, api);
api.getFilms().then((films) => {
  filmModel.films = films;
  boardPresenter.init();
});

// comments: ['301']
// film_info: {
//   actors: (10) ['Christian Bale', 'Robert De Niro', 'Leonardo DiCaprio', 'Brad Pitt', 'Edward Norton', 'Michael Caine', 'Morgan Freeman ', 'Cillian Murphy', 'Gary Oldman', 'Tom Hanks']
//   age_rating: 21
//   alternative_title: "Happiness Who Sold The Darkness"
//   description: "Oscar-winning film, a war drama about two young people, a film about a journey that heroes are about to make in finding themselves, with the best fight scenes since Bruce Lee."
//   director: "Akira Kurosawa"
//   genre: (3) ['Horror', 'Adventure', 'Drama']
//   poster: "images/posters/the-man-with-the-golden-arm.jpg"
//   release: {date: '2002-04-30T09:09:40.872Z', release_country: 'Germany'}
//   runtime: 149
//   title: "Friends Of The Carpet"
//   total_rating: 9.3
//   writers: (5) ['Brad Bird', 'Quentin Tarantino', 'Martin Scorsese', 'Robert Rodrigues', 'Stephen King']
// },
// id: "0"
// user_details: {
//   already_watched: true
//   favorite: true
//   watching_date: "2021-09-09T06:04:09.074Z"
//   watchlist: true
// }

// {
//   "id": "42",
//   "author": "Ilya O'Reilly",
//   "comment": "a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.",
//   "date": "2019-05-11T16:12:32.554Z",
//   "emotion": "smile"
// }
