import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createMiddleware from './middleware/clientMiddleware';
import makeRootReducer from './reducers';
import ApiClient from 'helpers/ApiClient';

export default (history, initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, createMiddleware(new ApiClient()), routerMiddleware(history)];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];
  let composeEnhancers = compose;
  if (__DEV__) {
    let devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (devTools) {
      if (typeof devTools === 'function') {
        composeEnhancers = devTools;
      }
    } else {
      devTools = require('containers/DevTools').default.instrument;
      if (typeof devTools === 'function') {
        enhancers.push(devTools());
      }
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store;
};
