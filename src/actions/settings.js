/* @flow */
import type { Action } from './types';

export const ADD_SETTING = 'ADD_SETTING';
export const REMOVE_SETTING = 'REMOVE_SETTING';

export const addSetting = (key: string, value: string): Action => ({
  type: ADD_SETTING,
  key,
  value,
});

export const removeSetting = (key: string): Action => ({
  type: REMOVE_SETTING,
  key,
});
