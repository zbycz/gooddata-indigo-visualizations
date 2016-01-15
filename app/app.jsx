require('babel-polyfill');
require('./styles/app');

import * as React from 'react';
import ReactDOM from 'react-dom';

import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import translations from './translations/en';

import Root from './containers/Root.jsx';
import { getProjectId, getCurrentHash } from './utils/location';

import store from './store';

ReactDOM.render(<Provider store={store}>
    <IntlProvider locale="en" messages={translations}>
        <Root projectId={getProjectId(getCurrentHash())} />
    </IntlProvider>
</Provider>, document.getElementById('app-analyze'));
