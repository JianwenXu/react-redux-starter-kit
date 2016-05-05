import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import hello from 'routes/Home/modules/hello';
import counter from 'routes/Counter/modules/counter';

export default combineReducers({
  hello,
  counter,
  router
});
