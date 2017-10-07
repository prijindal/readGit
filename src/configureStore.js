/* @flow */
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import reducer from './reducers';

/*
In this function we are defining what all data needs to be managed by the app
*/
export default function configureStore(): any {
  const middleware = applyMiddleware(logger);
  const store = createStore(reducer, middleware);
  return store;
}
