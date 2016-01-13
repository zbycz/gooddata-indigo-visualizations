import * as Actions from '../constants/Actions';
import * as AppContextReducer from './AppContextReducer';

export default (state, action) => {
    switch (action.type) {
        case Actions.BOOTSTRAP_DATA:
            return AppContextReducer.bootstrap(state, action);
        case Actions.BOOTSTRAP_ERROR:
            return AppContextReducer.bootstrapError(state);
        case Actions.LOGOUT_DATA:
            return AppContextReducer.loggedOut(state);
        default:
            return state;
    }
};
