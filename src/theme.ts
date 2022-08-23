import { Theme } from '@emotion/react';

export const font = {
  // YoonGothicRegular: require('../assets/font/YoonGothicRegular.otf'),
};

export const icon = {
  settings: require('../assets/icons/settings.png'),
  backward: require('../assets/icons/backward.png'),
};

export const lightTheme: Theme = {
  name: 'lightTheme',
  font: {
    // YoonGothicRegular: 'YoonGothicRegular',
  },
  color: {
    black: '#000',
    white: '#fff',
    header: '#F9F9F9',
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
    header: '#0A0A0A',
    divider: '#555555',
    text: '#ffffff',
    icon: '#ffffff',
    background: '#0A0A0A',
  },
  icon,
};
