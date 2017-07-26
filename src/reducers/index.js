/* @flow */
import { combineReducers } from 'redux';

import drawer from './drawer';
import settings from './settings';
import user from './user';

export default combineReducers({
  drawer,
  settings,
  user,
});
