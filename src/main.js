import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import makeRoutes from './routes';
import Root from './containers/Root';
import configureStore from './redux/configureStore';

const MOUNT_ELEMENT = document.getElementById('root');

// Configure history for react-router
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASENAME__
});

// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the key "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const store = configureStore(window.__INITIAL_STATE__, browserHistory);
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
});

let render = (key = null) => {
  // Now that we have the Redux store, we can create our routes. We provide
  // the store to the route definitions so that routes have access to it for
  // hooks such as `onEnter`.
  const routes = makeRoutes(store);
  ReactDOM.render(
    <Root history={history} routes={routes} store={store} />,
    MOUNT_ELEMENT
  );
};

// Enable HMR and catch runtime errors in RedBox
// This code is excluded from production bundle
if (__DEV__ && module.hot) {
  const renderApp = render;
  const renderError = (error) => {
    const RedBox = require('redbox-react');
    ReactDOM.render(<RedBox error={error} />, MOUNT_ELEMENT);
  };
  render = () => {
    try {
      renderApp(Math.random());
    } catch (error) {
      renderError(error);
    }
  };
  module.hot.accept(['./routes/index'], () => render());
}

render();
