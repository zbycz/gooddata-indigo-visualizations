export const BOOTSTRAP = ['bootstrapData'];

export const USER_FIRST_NAME = ['bootstrapData', 'accountSetting', 'firstName'];
export const USER_LAST_NAME = ['bootstrapData', 'accountSetting', 'lastName'];
export const PROFILE_SETTING_SEPARATORS = ['bootstrapData', 'profileSetting', 'separators'];
export const USER_EMAIL = ['bootstrapData', 'accountSetting', 'email'];
export const USER_URI = ['bootstrapData', 'accountSetting', 'links', 'self'];
export const USER_LOGIN_MD5 = ['bootstrapData', 'accountSetting', 'loginMD5'];
export const BOOTSTRAP_DATA_PERMISSIONS = ['bootstrapData', 'permissions'];

export const Permissions = {
    CAN_ACCESS_WORKBENCH: 'canAccessWorkbench',
    CAN_MANAGE_PROJECT_DASHBOARD: 'canManageProjectDashboard'
};

export const PROJECT_TEMPLATE = ['bootstrapData', 'project', 'template'];
export const PROJECT_TITLE = ['bootstrapData', 'project', 'title'];
export const PROJECT_URI = ['bootstrapData', 'project', 'uri'];

export const BRANDING = ['bootstrapData', 'branding'];
export const APPLE_TOUCH_ICON_URL = [...BRANDING, 'appleTouchIconUrl'];
export const IS_BRANDED = [...BRANDING, 'isBranded'];
export const ORGANIZATION_NAME = [...BRANDING, 'organizationName'];
export const FAVICON_URL = [...BRANDING, 'faviconUrl'];
export const APPLICATION_TITLE = [...BRANDING, 'applicationTitle'];

export const MENU_ITEMS = ['header', 'menuItems'];
export const ACCOUNT_MENU_ITEMS = ['header', 'accountMenuItems'];

export const PAGE_TITLE = ['pageTitle'];

export const DEVICE_VIEWPORT = ['meta', 'device', 'viewport'];
export const DEVICE_PIXEL_RATIO = ['meta', 'device', 'pixelRatio'];
export const IS_MOBILE_DEVICE = ['meta', 'device', 'isMobile'];
