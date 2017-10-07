/* @flow */

import type { Action } from './types';

export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

export const closeDrawer = (): Action => ({
  type: CLOSE_DRAWER,
});

export const openDrawer = (): Action => ({
  type: OPEN_DRAWER,
});

export const toggleDrawer = (): Action => ({
  type: CLOSE_DRAWER,
});
