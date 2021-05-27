/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import axiosMiddleware from 'redux-axios-middleware';
import thunk from 'redux-thunk';

import createReducer from './reducers';
import { axiosClient, axiosMiddlewareOptions } from './axiosClient';

export function configureStore(initialState = {}) {
  const middlewares = [thunk, axiosMiddleware(axiosClient(), axiosMiddlewareOptions)];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    // process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;
  /* eslint-enable */

  const store = createStore(createReducer(), fromJS(initialState), composeEnhancers(...enhancers));

  // Extensions
  // sagaMiddleware.run(rootSaga);
  store.asyncReducers = {}; // Async reducer registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      const createReducers = require('./reducers').default;
      const nextReducers = createReducers(store.asyncReducers);
      store.replaceReducer(nextReducers);
    });
  }

  return store;
}
const initialState = {};

const store = configureStore(initialState);

export default store;
