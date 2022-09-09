import { Theme } from '@emotion/react';

export const font = {
  // YoonGothicRegular: require('../assets/font/YoonGothicRegular.otf'),
};

export const icon = {
  backward: require('../assets/icons/backward.png'),
  check_circle: require('../assets/icons/check_circle.png'),
  splash: require('../assets/icons/splash.png'),
  edit: require('../assets/icons/edit.png'),
  favorites: require('../assets/icons/favorites.png'),
  favoritesfill: require('../assets/icons/favoritesfill.png'),
  lock: require('../assets/icons/lock.png'),
  cancel: require('../assets/icons/cancel.png'),
  delete: require('../assets/icons/delete.png'),
  empty: require('../assets/icons/empty.png'),
  plus: require('../assets/icons/plus.png'),
  search: require('../assets/icons/search.png'),
  settings: require('../assets/icons/settings.png'),
};

export const lightTheme: Theme = {
  name: 'lightTheme',
  font: {
    // YoonGothicRegular: 'YoonGothicRegular',
  },
  color: {
    black: '#000',
    white: '#fff',
    red: '#EB4250',
    sky_100: '#97c4f8',
    sky_200: '#85bbf7',
    sky_300: '#74b1f6',
    sky_400: '#529EF4',
    divider: '#cccccc',
    text: '#303030',
    icon: '#303030',
    shadow: '#878787',
    card: '#F5F5F9',
    chip: '#24ddb9',
    background: '#F9F9F9',
    pin: '#0A0A0A',
    bar: '#ebebeb',
  },
  icon,
};

export const darkTheme: Theme = {
  name: 'lightTheme',
  font: {
    // YoonGothicRegular: 'YoonGothicRegular',
  },
  color: {
    black: '#000',
    white: '#fff',
    red: '#EB4250',
    sky_100: '#97c4f8',
    sky_200: '#85bbf7',
    sky_300: '#74b1f6',
    sky_400: '#529EF4',
    divider: '#555555',
    text: '#ffffff',
    icon: '#ffffff',
    shadow: '#fffafa',
    card: '#0A0A0A',
    chip: '#0099ff',
    background: '#0A0A0A',
    pin: '#ffffff',
    bar: '#313131',
  },
  icon,
};
