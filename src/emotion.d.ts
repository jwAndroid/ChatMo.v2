import '@emotion/react';

import { icon } from './theme';

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';

declare module '@emotion/react' {
  export interface Theme {
    name: string;
    font: {
      // YoonGothicRegular: string;
    };
    color: {
      black: string;
      white: string;
      red: string;
      sky_100: string;
      sky_200: string;
      sky_300: string;
      sky_400: string;
      divider: string;
      text: string;
      icon: string;
      shadow: string;
      card: string;
      chip: string;
      background: string;
      pin: string;
    };
    icon: typeof icon;
  }
}
