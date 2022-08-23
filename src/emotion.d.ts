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
      header: string;
      divider: string;
      text: string;
      icon: string;
      background: string;
    };
    icon: typeof icon;
  }
}
