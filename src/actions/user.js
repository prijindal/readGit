/* @flow */
import type { Action } from './types';

export const SAVE_USER = 'SAVE_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const saveUser = (user: any): Action => ({
  type: SAVE_USER,
  payload: user,
});

export const logoutUser = (): Action => ({
  type: LOGOUT_USER,
});
