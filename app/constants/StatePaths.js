export const ERRORS = ['errors'];

export const BOOTSTRAP = ['bootstrapData'];

export const USER_FIRST_NAME = ['bootstrapData', 'accountSetting', 'firstName'];
export const USER_LAST_NAME = ['bootstrapData', 'accountSetting', 'lastName'];
export const FEATURE_FLAGS = ['bootstrapData', 'featureFlags'];
export const PROFILE_SETTING_SEPARATORS = ['bootstrapData', 'profileSetting', 'separators'];
export const USER_EMAIL = ['bootstrapData', 'accountSetting', 'email'];
export const USER_URI = ['bootstrapData', 'accountSetting', 'links', 'self'];
export const USER_LOGIN_MD5 = ['bootstrapData', 'accountSetting', 'loginMD5'];
export const BOOTSTRAP_DATA_PERMISSIONS = ['bootstrapData', 'permissions'];
export const BOOTSTRAP_IS_LOADED = ['bootstrapData', 'isBootstrapLoaded'];

export const Permissions = {
    CAN_ACCESS_WORKBENCH: 'canAccessWorkbench',
    CAN_MANAGE_PROJECT_DASHBOARD: 'canManageProjectDashboard'
};

export const PROJECT_TEMPLATE = ['bootstrapData', 'project', 'template'];
export const PROJECT_TITLE = ['bootstrapData', 'project', 'title'];
export const PROJECT_ID = ['bootstrapData', 'project', 'id'];
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

export const DATA = ['data'];
export const CATALOGUE = DATA.concat('catalogue');
export const CATALOGUE_ITEMS = CATALOGUE.concat('items');
export const CATALOGUE_TOTALS = CATALOGUE.concat('totals');
export const CATALOGUE_LOADING = CATALOGUE.concat('isLoading');
export const CATALOGUE_PAGE_LOADING = CATALOGUE.concat('isPageLoading');
export const CATALOGUE_QUERY = CATALOGUE.concat('query');
export const CATALOGUE_FILTERS = CATALOGUE.concat('filters');
export const CATALOGUE_PAGING = CATALOGUE.concat('paging');
export const CATALOGUE_ACTIVE_FILTER_INDEX = CATALOGUE.concat('activeFilterIndex');
export const CATALOGUE_ACTIVE_DATASET_ID = CATALOGUE.concat('activeDatasetId');

export const DATASETS = DATA.concat('datasets');

export const DIMENSIONS = DATA.concat('dimensions');
export const DIMENSIONS_AVAILABLE = DIMENSIONS.concat('dimensions');

export const BUCKETS = DATA.concat('buckets');

export const VISUALIZATION_TYPE = DATA.concat('visualizationType');
