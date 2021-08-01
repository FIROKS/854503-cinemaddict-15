import { getRandomInteger } from '../utils/utils';
import dayjs from 'dayjs';
import { EMOTIONS } from '../const';

const text = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
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

const generateMessage = () => text[getRandomInteger(0, text.length - 1)];

const generateEmotion = () => EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)];

const generateAuthor = () => names[getRandomInteger(0, names.length - 1)];

const generateDate = () => {
  const randomPeriods = {
    year: getRandomInteger(0, 2),
    mounth: getRandomInteger(0, 12),
    day: getRandomInteger(0, 30),
    hour: getRandomInteger(0, 30),
    minute: getRandomInteger(0, 30),
  };

  return dayjs()
    .subtract(randomPeriods.year, 'year')
    .subtract(randomPeriods.mounth, 'mounth')
    .subtract(randomPeriods.day, 'day')
    .format('YYYY[/]MM[/]DD HH[:]mm');
};

export const createCommentMock = () => ({
  date: generateDate(),
  author: generateAuthor(),
  message: generateMessage(),
  emotion: generateEmotion(),
});
