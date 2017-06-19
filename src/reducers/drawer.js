/* @flow */
import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { OPEN_DRAWER, CLOSE_DRAWER, TOGGLE_DRAWER } from '../actions/drawer';

export type State = boolean;

const INITIAL_STATE = Immutable(false);

const HANDLERS = {
  [TOGGLE_DRAWER]: (state: State = INITIAL_STATE): State => !state,
  [OPEN_DRAWER]: () => true,
  [CLOSE_DRAWER]: () => false,
};

export default createReducer(INITIAL_STATE, HANDLERS);
