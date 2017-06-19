/* @flow */

export type UserAction = {
  type: 'SET_USER',
  payload: string,
}

export type Action =
  { type: string }
    | UserAction

export type Dispatch = (action:Action | Array<Action>) => any;
export type GetState = () => Object;
export type PromiseAction = Promise<Action>;
