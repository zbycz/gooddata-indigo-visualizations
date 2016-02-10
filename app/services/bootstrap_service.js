import * as StatePaths from '../constants/StatePaths';
import * as MenuConstants from '../constants/Menu';

export function getViewport(state) {
    return state.getIn(StatePaths.DEVICE_VIEWPORT);
}

export function getDevicePixelRatio(state) {
    return state.getIn(StatePaths.DEVICE_PIXEL_RATIO);
}

export function getViewportInfo(state) {
    const viewport = getViewport(state);
    const devicePixelRatio = getDevicePixelRatio(state);

    return `(${viewport})*${devicePixelRatio}`;
}

export function getProjectTemplate(state) {
    return state.getIn(StatePaths.PROJECT_TEMPLATE);
}

export function getBootstrapData(state) {
    return state.getIn(StatePaths.BOOTSTRAP);
}

export function isBootstrapLoaded(appState) {
    return appState.getIn(StatePaths.BOOTSTRAP_IS_LOADED);
}

export function getUserEmail(bootstrap) {
    return bootstrap.getIn(StatePaths.USER_EMAIL);
}

export function getUserEmailDomain(state) {
    return state.getIn([...StatePaths.BOOTSTRAP, ...StatePaths.USER_EMAIL], '').split('@').pop();
}

export function getUserUri(bootstrap) {
    return bootstrap.getIn(StatePaths.USER_URI);
}

export function getUserLoginMD5(state) {
    return state.getIn(StatePaths.USER_LOGIN_MD5);
}

export function hasPermission(state, permission) {
    return !!state.getIn([...StatePaths.BOOTSTRAP_DATA_PERMISSIONS, permission]);
}

export function canEnterEditMode(state) {
    return hasPermission(state, StatePaths.Permissions.CAN_MANAGE_PROJECT_DASHBOARD);
}

export function getUserFullName(appState) {
    const firstName = appState.getIn(StatePaths.USER_FIRST_NAME);
    const lastName = appState.getIn(StatePaths.USER_LAST_NAME);

    return `${firstName} ${lastName}`;
}

export function getBranding(appState) {
    return appState.getIn(StatePaths.BRANDING);
}

export function isBranded(appState) {
    return appState.getIn(StatePaths.IS_BRANDED);
}

export function getOrganizationName(appState) {
    return appState.getIn(StatePaths.ORGANIZATION_NAME);
}

export function getAppleTouchIconUrl(appState) {
    return appState.getIn(StatePaths.APPLE_TOUCH_ICON_URL);
}

export function getFaviconUrl(appState) {
    return appState.getIn(StatePaths.FAVICON_URL);
}

export function getApplicationTitle(appState) {
    return appState.getIn(StatePaths.APPLICATION_TITLE);
}

export function getPageTitle(appState) {
    return appState.getIn(StatePaths.PAGE_TITLE);
}

export function getProjectTitle(appState) {
    return appState.getIn(StatePaths.PROJECT_TITLE);
}

export function getProjectUri(appState) {
    return appState.getIn(StatePaths.PROJECT_URI);
}

export function getProject(appState) {
    return {
        title: getProjectTitle(appState),
        uri: getProjectUri(appState)
    };
}

export function getMenuItems(appState) {
    return appState.getIn(StatePaths.MENU_ITEMS);
}

export function getLocalizedMenuItems(appState, intl) {
    var menuItems = getMenuItems(appState);
    return menuItems.map(menuItem => {
        menuItem.title = intl.formatMessage({ id: menuItem[MenuConstants.ITEM_TRANSLATION_KEY] });
        return menuItem;
    });
}

export function getAccountMenuItems(appState) {
    return appState.getIn(StatePaths.ACCOUNT_MENU_ITEMS);
}

export function getLocalizedAccountMenuItems(appState, intl) {
    var menuItems = getAccountMenuItems(appState);
    return menuItems.map(menuItem => {
        menuItem.title = intl.formatMessage({ id: menuItem[MenuConstants.ITEM_TRANSLATION_KEY] });
        return menuItem;
    });
}

export function isMobileDevice(appState) {
    return appState.getIn(StatePaths.IS_MOBILE_DEVICE);
}

export function getSeparators(appState) {
    return appState.getIn(StatePaths.PROFILE_SETTING_SEPARATORS);
}

export function isCsvUploaderEnabled(appState) {
    return appState.getIn(StatePaths.FEATURE_FLAGS).get('enableCsvUploader');
}
