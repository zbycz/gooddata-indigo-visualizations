import $ from 'jquery';

import { isMobile } from '../utils/BrowserDetect';

import * as Actions from '../constants/Actions';
import * as API from '../utils/api';
import * as RouterService from '../services/router_service';

function parseUri(uri) {
    const { route, params } = RouterService.parseUri(uri);
    return { route, ...params };
}

function bootstrapDataReceived(bootstrapData, windowInstance) {
    const $window = $(windowInstance);
    const viewportWidth = $window.width();
    const viewportHeight = $window.height();

    var windowInfo = {
        viewport: `${viewportWidth}x${viewportHeight}`,
        pixelRatio: windowInstance.devicePixelRatio || 1,
        isMobileDevice: isMobile(windowInstance)
    };

    return {
        type: Actions.BOOTSTRAP_DATA,
        bootstrapData,
        windowInfo
    };
}

function bootstrapError(reason) {
    return {
        type: Actions.BOOTSTRAP_ERROR,
        data: reason
    };
}

function loggedOut() {
    return {
        type: Actions.LOGOUT_DATA
    };
}

export function bootstrap(windowInstance) {
    return dispatch => {
        dispatch({
            type: Actions.BOOTSTRAP
        });
        let currentHash = RouterService.getCurrentHash();
        let parsedUri = parseUri(currentHash);
        API.bootstrap(parsedUri.projectId)
            .then(
                bootstrapData => dispatch(bootstrapDataReceived(bootstrapData, windowInstance)),
                reason => dispatch(bootstrapError(reason)));
    };
}

export function logoutRequested() {
    return dispatch => {
        dispatch({
            type: Actions.LOGOUT
        });
        API.logout().then(() => {
            dispatch(loggedOut());
        }, rejectedReason => {
            console.warn('logout failed', rejectedReason);
        });
    };
}
