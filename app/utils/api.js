import Promise from 'bluebird';
import sdk from 'sdk';
import { string } from 'js-utils';

// Setup SDK's session id before first usage
const sessionId = 'dash_' + string.randomString(10) + '_';
sdk.xhr.ajaxSetup({
    beforeSend(xhr) {
        xhr.setRequestHeader('X-GDC-REQUEST', sessionId + string.randomString(10));
    }
});

function wrapPromise(promise) {
    return Promise.resolve(promise);
}

export function bootstrap(projectId) {
    let uri = '/gdc/app/account/bootstrap';
    if (projectId) {
        uri = uri + `?projectUri=/gdc/projects/${projectId}`;
    }
    return wrapPromise(sdk.xhr.get(uri));
}
