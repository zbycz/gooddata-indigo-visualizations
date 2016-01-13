require('babel-polyfill');
require('./styles/app');

import * as React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root.jsx';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import routerEffectHandler from './effect-handlers/RouteEffectHandler';

import rootReducer from './reducers/RootReducer';
import initialState from './reducers/InitialReduction';

const effectsHandlingMiddleware = store => next => action => {
    const result = next(action);
    store.getState().get('effects').forEach(effect => {
        routerEffectHandler(effect, store.dispatch);
    });

    return result;
};

const setupAppStore = state => {
    const createStoreWithMiddleware =
        applyMiddleware(thunkMiddleware, effectsHandlingMiddleware)(createStore);
    return createStoreWithMiddleware(rootReducer, state);
};

ReactDOM.render(<Provider store={setupAppStore(initialState)}>
    <Root />
</Provider>, document.getElementById('app-analyze'));
