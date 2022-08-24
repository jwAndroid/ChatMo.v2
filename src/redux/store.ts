import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';

export const store = configureStore(
  {
    reducer: rootReducer,
  },
  composeWithDevTools()
);
