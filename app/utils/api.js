import Promise from 'bluebird';
import { xhr, user } from 'gooddata';
import { string } from 'js-utils';
import { sortBy, omit, get } from 'lodash';
import deserializeItems from '../services/catalogue_item_deserializer';
import { LOAD_ERROR, NOT_AUTHORIZED_ERROR } from '../constants/Errors';
import { t } from '../utils/translations';

// Setup SDK's session id before first usage
const sessionId = 'dash_' + string.randomString(10) + '_';
xhr.ajaxSetup({
    beforeSend(xhrClient) {
        xhrClient.setRequestHeader('X-GDC-REQUEST', sessionId + string.randomString(10));
    }
});

const REQUEST_DEFAULTS = {
    types: ['attribute', 'metric', 'fact'],
    paging: {
        offset: 0,
        limit: 'ALL'
    }
};

function wrapPromise(promise) {
    return Promise.resolve(promise);
}

export function getCsvUploaderUrl(projectId) {
    return `/data/#/projects/${projectId}/upload`;
}

export function bootstrap(projectId) {
    let uri = '/gdc/app/account/bootstrap';

    if (projectId) {
        uri = uri + `?projectUri=/gdc/projects/${projectId}`;
    }

    return wrapPromise(xhr.get(uri)).then(
        data => {
            let currentProject = get(data, 'bootstrapResource.current.project');

            if (!currentProject) {
                return Promise.reject({
                    type: LOAD_ERROR,
                    errorMessage: t('error.project.not_found', { projectId })
                });
            }

            return data;
        },
        () => Promise.reject({ type: NOT_AUTHORIZED_ERROR })
    );
}

export function loadDateDimensions(pid, options) {
    let uri = `/gdc/internal/projects/${pid}/loadDateDims`;

    let request = Object.assign({}, REQUEST_DEFAULTS, options, {
        paging: {
            offset: 0,
            limit: 'ALL'
        }
    });

    request = omit(request, ['filter', 'types', 'paging']);

    let $promise = xhr.ajax(uri, {
        type: 'POST',
        data: { dateDimsRequest: request }
    });

    return wrapPromise($promise).then(res => {
        let { dimensions, unavailable } = res.dateDimsResponse;

        return {
            dimensions: dimensions ? deserializeItems(dimensions) : [],
            unavailable: unavailable ? deserializeItems(unavailable) : []
        };
    });
}

export function loadCatalogueItems(projectId, options) {
    let uri = `/gdc/internal/projects/${projectId}/loadCatalog`;

    let request = Object.assign({}, REQUEST_DEFAULTS, options);

    let $promise = xhr.ajax(uri, {
        type: 'POST',
        data: { catalogRequest: request }
    });

    return wrapPromise($promise).then(res => {
        let data = res.catalogResponse;

        data.catalog = deserializeItems(data.catalog);

        return data;
    });
}

export function loadDatasets(projectId) {
    function createDataset(data) {
        let dataset = data.dataset;

        return {
            name: dataset.name,
            identifier: dataset.datasetId,
            author: dataset.firstSuccessfulUpdate.owner.profileUri
        };
    }

    let uri = `/gdc/dataload/internal/projects/${projectId}/csv/datasets`;
    let $promise = xhr.get(uri);

    return $promise.then(result => {
        let datasets = result.datasets.items.map(createDataset);
        return sortBy(datasets, dataset => dataset.name.toLowerCase());
    });
}

export function loadCatalogue(projectId, options) {
    return Promise.props({
        catalog: loadCatalogueItems(projectId, options),
        dateDimensions: loadDateDimensions(projectId, options)
    });
}

export function logout() {
    return wrapPromise(user.logout());
}
