import { Record, Map, List, fromJS } from 'immutable';
import get from 'lodash/object/get';
import keys from 'lodash/object/keys';
import buildMessage from '../utils/MessageBuilder';

import * as Header from 'goodstrap/packages/Header/ReactHeader';

import * as Effects from '../constants/Effects';
import * as BootstrapService from '../services/bootstrap_service';
import * as StatePaths from '../constants/StatePaths';
import * as MenuConstants from '../constants/Menu';

const BootstrapDataRecord = new Record({
    project: {},
    permissions: {},
    profileSetting: {},
    accountSetting: {},
    branding: {},
    featureFlags: {}
});

const TRANSLATIONS = {
    kpis: 'header.kpis',
    dashboards: 'header.dashboards',
    analyze: 'header.analyze',
    reports: 'header.reports',
    manage: 'header.manage',
    load: 'header.load',
    account: 'header.account',
    dic: 'header.dic',
    logout: 'header.logout'
};

const ActiveMenuItems = 'analyze';
const NotAuthorizedUrl = '/projects.html#status=notAuthorized';
const NoWorkbenchAccessUrl = '/projects.html#status=cannotAccessWorkbench';

function transformBootstrapData(bootstrapData) {
    function transformProject(current) {
        const project = current.project;
        const projectTemplate = get(current, ['projectTemplates', 0, 'url']);
        const uri = project.links.self;

        return new Map({
            id: project.links.self.split('/').pop(),
            uri,
            title: project.meta.title,
            template: projectTemplate
        });
    }

    function transformProfileSetting() {
        return fromJS({
            ...bootstrapData.bootstrapResource.profileSetting
        });
    }

    function transformPermissions(bootstrapPermissions) {
        return new Map(keys(bootstrapPermissions).reduce((permissions, permission) => {
            permissions[permission] = bootstrapPermissions[permission] === '1';
            return permissions;
        }, {}));
    }

    function transformAccountSetting() {
        return fromJS({
            ...bootstrapData.bootstrapResource.accountSetting,
            loginMD5: bootstrapData.bootstrapResource.current.loginMD5
        });
    }

    const bootstrapPermissions = get(
        bootstrapData,
        ['bootstrapResource', 'current', 'projectPermissions', 'permissions'],
        {});

    return new BootstrapDataRecord({
        project: transformProject(bootstrapData.bootstrapResource.current),
        permissions: transformPermissions(bootstrapPermissions),
        accountSetting: transformAccountSetting(),
        profileSetting: transformProfileSetting(),
        branding: fromJS(bootstrapData.bootstrapResource.settings),
        featureFlags: fromJS(bootstrapData.bootstrapResource.current.featureFlags)
    });
}

function hackMenuForTranslations(menu) {
    return menu.map(menuItem => {
        menuItem[MenuConstants.ITEM_TRANSLATION_KEY] = menuItem.title;
        delete menuItem.title;
        return menuItem;
    });
}

export const bootstrap = (state, action) => {
    const data = action.bootstrapData;
    const windowInfo = action.windowInfo;
    // if user has not current project accessible bootstrap resource
    // returns 200 OK but with empty response - so here we check if current.project
    // is null and if it is we redirect to projects.html
    const currentProject = get(data, ['bootstrapResource', 'current', 'project']);
    if (!currentProject) {
        return state.setIn('effects', [buildMessage(Effects.REDIRECTION, NotAuthorizedUrl)]);
    }

    const appState = state.get('appState');

    const mutatedAppState = appState.withMutations(mutableState => {
        const currentPageTitle = BootstrapService.getPageTitle(mutableState);
        const applicationTitle = BootstrapService.getApplicationTitle(mutableState);
        const headerMenu = hackMenuForTranslations(Header.generateHeaderMenu(data, {
            translations: TRANSLATIONS,
            activeItem: ActiveMenuItems
        }));
        const headerAccountMenu = hackMenuForTranslations(
            Header.generateAccountMenu(data, { translations: TRANSLATIONS })
        );

        mutableState
            .setIn(StatePaths.BOOTSTRAP, transformBootstrapData(data))
            .setIn(StatePaths.PAGE_TITLE, `${currentPageTitle} - ${applicationTitle}`)
            .setIn(StatePaths.MENU_ITEMS, new List(headerMenu))
            .setIn(StatePaths.ACCOUNT_MENU_ITEMS, new List(headerAccountMenu))
            .setIn(StatePaths.DEVICE_VIEWPORT, windowInfo.viewport)
            .setIn(StatePaths.DEVICE_PIXEL_RATIO, windowInfo.pixelRatio)
            .setIn(StatePaths.IS_MOBILE_DEVICE, windowInfo.isMobileDevice);
    });

    // embedded-only user
    if (!BootstrapService.hasPermission(mutatedAppState, StatePaths.Permissions.CAN_ACCESS_WORKBENCH)) {
        return state.setIn('effects', [buildMessage(Effects.REDIRECTION, NoWorkbenchAccessUrl)]);
    }

    if (!mutatedAppState.getIn(['router', 'route'])) {
        let hash = mutatedAppState.getIn(['bootstrapData', 'project', 'id']);
        state.setIn('effects', [buildMessage(Effects.SET_HASH, hash)]);
    }

    return state.set('appState', mutatedAppState);
};

export const bootstrapError = state => {
    const url = encodeURIComponent(location.href);
    var loginRedirectionUrl = `/account.html?lastUrl=${url}#/login`;
    var loginRedirectionEffect = buildMessage(Effects.REDIRECTION, loginRedirectionUrl);
    return state.set('effects', [loginRedirectionEffect]);
};

export const loggedOut = state => {
    var logoutRedirectionEffect = buildMessage(Effects.REDIRECTION, '/');
    return state.set('effects', [logoutRedirectionEffect]);
};
