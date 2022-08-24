import { combineReducers } from 'redux';

import { system } from './system';

const rootReducer = combineReducers({
  system,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
