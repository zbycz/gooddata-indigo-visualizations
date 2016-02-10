import { fromJS } from 'immutable';
import * as DatasetConstants from '../constants/Datasets';

const initialPaging = {
    start: 0,
    end: 39
};

export default fromJS({
    appState: {
        header: {
            accountMenuItems: [],
            menuItems: []
        },
        bootstrapData: {
            isBootstrapLoaded: false,
            featureFlags: {
                enableCsvUploader: false
            }
        },
        dimensions: {
            data: [],
            meta: {
                loading: false,
                loaded: false
            }
        },
        errors: [],
        pageTitle: 'Analyze',
        meta: {
            device: {
                viewport: '0x0',
                pixelRatio: 0,
                isMobile: false
            }
        }
    },
    data: {
        catalogue: {
            items: [],
            filters: [{
                name: 'all',
                label: 'catalogue.filter.all',
                types: ['metric', 'attribute', 'fact']
            }, {
                name: 'metrics',
                label: 'catalogue.filter.metrics',
                types: ['metric', 'fact']
            }, {
                name: 'attributes',
                label: 'catalogue.filter.attributes',
                types: ['attribute']
            }],
            activeFilterIndex: 0,
            activeDatasetId: DatasetConstants.ALL_DATA_ID,
            isLoading: false,
            isPageLoading: false,
            query: '',
            paging: initialPaging,
            totals: {
                available: 0,
                unavailable: 0
            }
        },
        dimensions: {},
        datasets: {}
    },
    effects: []
});
