import $ from 'jquery';

import { isMobile } from '../utils/BrowserDetect';
import { catalogueRequested, datasetsRequested } from './data_actions';
import * as Actions from '../constants/Actions';
import * as API from '../utils/api';
import { isCsvUploaderEnabled } from '../services/bootstrap_service';

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

function bootstrapError(error, location) {
    return {
        type: Actions.BOOTSTRAP_ERROR,
        location,
        error
    };
}

function loggedOut(location) {
    return { type: Actions.LOGOUT_DATA, location };
}

export function bootstrap(windowInstance, projectId, loadBootstrap = API.bootstrap) {
    return (dispatch, getState) => {
        dispatch({ type: Actions.BOOTSTRAP });

        return loadBootstrap(projectId)
            .then(
                bootstrapData => {
                    dispatch(bootstrapDataReceived(bootstrapData, windowInstance));

                    let state = getState().get('appState');

                    if (isCsvUploaderEnabled(state)) {
                        dispatch(datasetsRequested(projectId));
                    }

                    dispatch(catalogueRequested(projectId));
                }
            )
            .catch(error => {
                return dispatch(bootstrapError(error, windowInstance.location));
            });
    };
}

export function logoutRequested(windowInstance) {
    return dispatch => {
        dispatch({ type: Actions.LOGOUT });

        API.logout().finally(() => dispatch(loggedOut(windowInstance.location)));
    };
}
