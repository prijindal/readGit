/* @flow */
import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import type { Action } from '../actions/types';
import { ADD_SETTING, REMOVE_SETTING } from '../actions/settings';

export type State = {
  key: string,
};

const INITIAL_STATE = Immutable({});

const addSetting = (state: State = INITIAL_STATE, action: Action): State => ({
  ...state,
  [action.key]: action.value,
});

const removeSetting = (state: State = INITIAL_STATE, action: Action): State =>
  Object.keys(state)
    .filter(i => i !== 'grouprepo')
    .reduce((prev, key) => ({ ...prev, [key]: state[key] }), {});

const HANDLERS = {
  [ADD_SETTING]: addSetting,
  [REMOVE_SETTING]: removeSetting,
};

export default createReducer(INITIAL_STATE, HANDLERS);
