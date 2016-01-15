import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers/root_reducer';
import initialState from './reducers/initial_state';

let appStore = applyMiddleware(thunk)(createStore);

export default appStore(rootReducer, initialState);
