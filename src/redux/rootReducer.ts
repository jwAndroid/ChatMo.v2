import { combineReducers } from 'redux';

import { system } from './system';
import { auth } from './auth';
import { posts } from './posts';

const rootReducer = combineReducers({
  system,
  auth,
  posts,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
