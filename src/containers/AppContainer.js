import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

class AppContainer extends React.Component {
  get content () {
    const { history, routes, routerKey } = this.props;
    return <Router history={history} children={routes} key={routerKey} />;
  }

  get devTools () {
    if (__DEBUG__) {
      if (!window.devToolsExtension) {
        const DevTools = require('./DevTools').default;
        return <DevTools />;
      } else {
        window.devToolsExtension.open();
      }
    }
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
  routes: React.PropTypes.element.isRequired,
  routerKey: React.PropTypes.number,
  store: React.PropTypes.object.isRequired
};

export default AppContainer;
