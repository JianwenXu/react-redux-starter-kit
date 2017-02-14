import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

class AppContainer extends React.Component {
  get content () {
    const { history, routes } = this.props;
    return <Router history={history} children={routes} />;
  }

  get devTools () {
    if (__DEV__) {
      if (!window.devToolsExtension) {
        const DevTools = require('./DevTools').default;
        return <DevTools />;
      }
    }
  }

  shouldComponentUpdate () {
    return false;
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          {this.content}
          {this.devTools}
        </div>
      </Provider>
    );
  }
}

AppContainer.propTypes = {
  history: React.PropTypes.object.isRequired,
  routes: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired
};

export default AppContainer;
