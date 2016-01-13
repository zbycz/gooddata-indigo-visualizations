import Crossroads from 'crossroads';
const INDEX = 'INDEX';

const ROUTER_QUERY_ALERT = ['appState', 'router', 'query', 'alert'];
const ROUTER_QUERY_ALERT_EDIT = ['appState', 'router', 'query', 'editAlert'];

let currentRouteName, currentRouteParams;
Crossroads.bypassed.add((req) => {
    currentRouteName = null;
    currentRouteParams = null;
    if (DEBUG) {
        console.warn(`ROUTER: could not match any route with URL: ${req}`);
    }
});

Crossroads.shouldTypecast = true;

Crossroads.addRoute('/p/{projectId}/:?query:', (projectId, query) => {
    currentRouteName = INDEX;
    currentRouteParams = { projectId, query };
    if (DEBUG) {
        console.log(`ROUTER: Routed to: ${currentRouteName} with params: ${JSON.stringify(currentRouteParams)}`);
    }
});

export function getCurrentRoute() {
    return currentRouteName;
}

export function getCurrentRouteParams() {
    return currentRouteParams;
}

export function parseUri(uri) {
    let clippedUri = uri.substring(1);
    Crossroads.parse(clippedUri);

    return { route: getCurrentRoute(), params: getCurrentRouteParams() };
}

export function getCurrentHash() {
    return window.location.hash;
}

export function setHash(hash) {
    window.location.hash = hash;
}

export function setHref(href) {
    window.location.href = href;
}

export function getProjectUri(state) {
    return state.getIn(['router', 'projectId']);
}

export function getRouteQueryAlert(reduction) {
    return reduction.getIn(ROUTER_QUERY_ALERT);
}

export function getRouteQueryAlertEdit(reduction) {
    return reduction.getIn(ROUTER_QUERY_ALERT_EDIT);
}
