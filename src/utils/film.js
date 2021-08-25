import dayjs from 'dayjs';

export const getYear = (date) => dayjs(date).format('YYYY');

export const getFullDate = (date) => dayjs(date).format('DD MMMM YYYY');
