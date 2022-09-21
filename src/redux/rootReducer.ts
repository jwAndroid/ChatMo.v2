import { combineReducers } from 'redux';

import { system } from './system';
import { auth } from './auth';
import { posts } from './posts';
import { chat } from './chat';

const rootReducer = combineReducers({
  system,
  auth,
  posts,
  chat,
});

export default rootReducer;
