/* @flow */
import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import type { Action } from '../actions/types';
import { SAVE_USER, LOGOUT_USER } from '../actions/user';

export type State = {
  name: string,
  token: string,
};

const INITIAL_STATE = Immutable({});

const HANDLERS = {
  [SAVE_USER]: (state: State = INITIAL_STATE, action: Action): State => ({ ...action.payload }),
  [LOGOUT_USER]: () => INITIAL_STATE,
};

export default createReducer(INITIAL_STATE, HANDLERS);
