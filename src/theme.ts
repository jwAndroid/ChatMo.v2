import { Theme } from '@emotion/react';

export const font = {
  // YoonGothicRegular: require('../assets/font/YoonGothicRegular.otf'),
};

export const icon = {
  settings: require('../assets/icons/settings.png'),
  backward: require('../assets/icons/backward.png'),
  splash: require('../assets/icons/splash.png'),
  edit: require('../assets/icons/edit.png'),
  favorites: require('../assets/icons/favorites.png'),
  lock: require('../assets/icons/lock.png'),
  delete: require('../assets/icons/delete.png'),
  empty: require('../assets/icons/empty.png'),
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
    background: '#F9F9F9',
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
    background: '#0A0A0A',
  },
  icon,
};
