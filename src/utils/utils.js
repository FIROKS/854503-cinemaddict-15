import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomNumber = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

export const capitalizeFirstLetter = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1),
  ];
};

export const sortByCommentsAmount = (filmA, filmB) => {
  if (filmA.commentsCount > filmB.commentsCount) {
    return -1;
  }

  if (filmA.commentsCount < filmB.commentsCount) {
    return 1;
  }

  return 0;
};

export const sortByRating = (filmA, filmB) => {
  if (filmA.rating > filmB.rating) {
    return -1;
  }

  if (filmA.rating < filmB.rating) {
    return 1;
  }

  return 0;
};

export const sortByDate = (filmA, filmB) => {
  if (dayjs(filmA.date).isAfter(filmB.date)) {
    return -1;
  }

  if (dayjs(filmA.date).isBefore(filmB.date)) {
    return 1;
  }

  return 0;
};
