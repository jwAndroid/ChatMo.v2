import { Theme } from '@emotion/react';

export const font = {
  NotoSans_Regular: require('../assets/fonts/NotoSans_Regular.otf'),
};

export const image = {
  logo: require('../assets/image/logo.png'),
  splash: require('../assets/image/splash.png'),
};

export const icon = {
  add: require('../assets/icons/add.png'),
  backward: require('../assets/icons/backward.png'),
  cancel: require('../assets/icons/cancel.png'),
  check_circle: require('../assets/icons/check_circle.png'),
  check: require('../assets/icons/check.png'),
  delete: require('../assets/icons/delete.png'),
  edit: require('../assets/icons/edit.png'),
  favorite: require('../assets/icons/favorite.png'),
  flash_off: require('../assets/icons/flash_off.png'),
  flash_on: require('../assets/icons/flash_on.png'),
  flip_camera: require('../assets/icons/flip_camera.png'),
  img_stack: require('../assets/icons/img_stack.png'),
  lock: require('../assets/icons/lock.png'),
  more_vert: require('../assets/icons/more_vert.png'),
  photo_camera: require('../assets/icons/photo_camera.png'),
  search: require('../assets/icons/search.png'),
  send_message: require('../assets/icons/send_message.png'),
  setting: require('../assets/icons/setting.png'),
  warning_sign: require('../assets/icons/warning_sign.png'),
};

export const lightTheme: Theme = {
  name: 'lightTheme',
  font: {
    NotoSans_Regular: 'NotoSans_Regular',
  },
  image,
  icon,
  color: {
    black: '#000',
    white: '#fff',
    red: '#EB4250',
    gray: '#878787',
    yellow: '#FFDC5E',
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
    placeholder: '#cccccc',
  },
};

export const darkTheme: Theme = {
  name: 'darkTheme',
  font: {
    NotoSans_Regular: 'NotoSans_Regular',
  },
  image,
  icon,
  color: {
    black: '#000',
    white: '#fff',
    red: '#EB4250',
    gray: '#878787',
    yellow: '#FFDC5E',
    sky_100: '#97c4f8',
    sky_200: '#85bbf7',
    sky_300: '#74b1f6',
    sky_400: '#529EF4',
    divider: '#555555',
    text: '#ffffff',
    icon: '#ffffff',
    shadow: '#fffafa',
    card: '#313131',
    chip: '#0099ff',
    background: '#0A0A0A',
    pin: '#ffffff',
    bar: '#313131',
    placeholder: '#1B2430',
  },
};
