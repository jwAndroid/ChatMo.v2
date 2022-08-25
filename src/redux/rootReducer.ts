import { combineReducers } from 'redux';

import { system } from './system';
import { auth } from './auth';

const rootReducer = combineReducers({
  system,
  auth,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
