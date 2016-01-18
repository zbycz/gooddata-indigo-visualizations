require('babel-polyfill');
require('./styles/app');

import * as React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import translations from './translations/en';

import Root from './containers/Root.jsx';
import rootReducer from './reducers/root_reducer';
import initialState from './reducers/initial_state';
import { getProjectId, getCurrentHash } from './utils/location';

const setupAppStore = applyMiddleware(thunk)(createStore);

ReactDOM.render(<Provider store={setupAppStore(rootReducer, initialState)}>
    <IntlProvider locale="en" messages={translations}>
        <Root projectId={getProjectId(getCurrentHash())} />
    </IntlProvider>
</Provider>, document.getElementById('app-analyze'));
