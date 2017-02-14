import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import hello from 'routes/Home/modules/hello';
import counter from 'routes/Counter/modules/counter';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    hello,
    counter,
    router,
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) {
    return;
  }
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
