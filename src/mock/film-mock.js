import { getRandomInteger, getRandomNumber } from '../utils/utils';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { createCommentMock } from './comment-mock';

const titles = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const text = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
];

const posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const names = [
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Anthony Mann',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
];

const genres = [
  'Drama',
  'Film-Noir',
  'Mystery',
  'Comedy',
  'Western',
  'Musical',
];

const countries = [
  'USA',
  'Italy',
  'Mexico',
  'Canada',
  'Germany',
  'France',
];

const ageRating = [
  '12+',
  '13+',
  '17+',
  '18+',
];

const generatePoster = () => posters[getRandomInteger(0, posters.length - 1)];

const generateTitle = () => titles[getRandomInteger(0, titles.length - 1)];

const generateCountry = () => countries[getRandomInteger(0, countries.length - 1)];

const generateName = () => names[getRandomInteger(0, names.length - 1)];

const generateDescription = () => {
  const amount = getRandomInteger(1, 5);

  return new Array(amount).fill().map(() => text[getRandomInteger(0, text.length - 1)]).join(' ');
};

const generateDate = () => {
  const startDate = 1970;

  const randomPeriods = {
    year: getRandomInteger(0, 40),
    month: getRandomInteger(0, 12),
    day: getRandomInteger(0, 30),
  };

  return dayjs(startDate)
    .add(randomPeriods.year, 'year')
    .add(randomPeriods.month, 'month')
    .add(randomPeriods.day, 'day').toDate();
};

const geterateDuration = () => dayjs().format('H[h] mm[m]');

const geterateRating = () => getRandomNumber(0, 10).toString().slice(0, 3);

const geterateAgeRating = () => ageRating[getRandomInteger(0, ageRating.length - 1)];


const generateGenres = () => {
  const amount = getRandomInteger(1, 6);
  const genresList = new Array(amount).fill().map(() => genres[getRandomInteger(0, genres.length - 1)]);

  return Array.from(new Set(genresList));
};

const generateNames = () => {
  const amount = getRandomInteger(1, 7);
  const namesList = new Array(amount).fill().map(() => names[getRandomInteger(0, names.length - 1)]);

  return Array.from(new Set(namesList));
};

const generateComments = () => {
  const amount = getRandomInteger(1, 20);

  return new Array(amount).fill().map(() => createCommentMock());
};

export const createFilmMock = () => {
  const comments = generateComments();
  const commentsCount = comments.length;

  return {
    id: nanoid(),
    title: generateTitle(),
    originalTitle: generateTitle(),
    genres: generateGenres(),
    director: generateName(),
    writers: generateNames(),
    actors: generateNames(),
    country: generateCountry(),
    poster: generatePoster(),
    description: generateDescription(),
    comments,
    rating: geterateRating(),
    ageRating: geterateAgeRating(),
    date: generateDate(),
    duration: geterateDuration(),
    commentsCount,
    inWatchlist: Boolean(getRandomInteger(0, 1)),
    inHistory: Boolean(getRandomInteger(0, 1)),
    inFavorites: Boolean(getRandomInteger(0, 1)),
  };
};
