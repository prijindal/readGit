/* @flow */

export type Action = { type: string, payload?: any };

export type Dispatch = (action: Action | Array<Action>) => any;
export type GetState = () => Object;
export type PromiseAction = Promise<Action>;
