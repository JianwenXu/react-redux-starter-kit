import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

class Root extends React.Component {
  get content () {
    return (
      <Router history={this.props.history}>
        {this.props.routes}
      </Router>
    );
  }

  get devTools () {
    if (__DEBUG__) {
      if (!window.devToolsExtension) {
        const DevTools = require('containers/DevTools').default;
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

Root.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.element.isRequired,
  store: PropTypes.object.isRequired
};

export default Root;
