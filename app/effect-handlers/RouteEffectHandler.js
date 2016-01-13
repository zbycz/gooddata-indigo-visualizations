import * as Effects from '../constants/Effects';
import * as RouterService from '../services/router_service';

// TODO: Remove the directive once dispatch is used.
/* eslint no-unused-vars: 0 */
export default (effect, dispatch) => {
    const { type, payload } = effect;

    switch (type) {
        case Effects.REDIRECTION:
            RouterService.setHref(payload);
            break;
        case Effects.SET_HASH:
            RouterService.setHash(`/p/${payload}`);
            break;
        default:
            break;
    }
};
