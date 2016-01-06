import { fromJS } from 'immutable';

export default fromJS({
    appState: {
        header: {
            accountMenuItems: [],
            menuItems: []
        },
        bootstrapData: null,
        dimensions: {
            data: [],
            meta: {
                loading: false,
                loaded: false
            }
        },
        pageTitle: 'Analyze',
        router: {
            route: null,
            projectId: null,
            dashboardId: null,
            alertId: null,
            query: {
                editAlert: false
            }
        },
        meta: {
            device: {
                viewport: '0x0',
                pixelRatio: 0,
                isMobile: false
            }
        }
    },
    effects: []
});
