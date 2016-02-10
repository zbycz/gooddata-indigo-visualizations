import * as Actions from '../constants/Actions';
import * as StatePaths from '../constants/StatePaths';
import { loadDetails } from '../services/catalogue_details_loader';
import { getUserUri } from '../services/bootstrap_service';
import { groupDatasets } from '../services/dataset_service';
import * as API from '../utils/api';
import { debounce } from 'lodash';

function createRequest(state) {
    const activeFilterIndex = state.getIn(StatePaths.CATALOGUE_ACTIVE_FILTER_INDEX);
    const filter = state.getIn(StatePaths.CATALOGUE_FILTERS).get(activeFilterIndex).toJS();

    const query = state.getIn(StatePaths.CATALOGUE_QUERY);

    const activeDatasetId = state.getIn(StatePaths.CATALOGUE_ACTIVE_DATASET_ID);

    let request = {
        types: filter.types
    };

    if (query) {
        request.filter = query;
    }

    if (activeDatasetId) {
        request.dataSetIdentifier = activeDatasetId;
    }

    return request;
}

export function requestCatalogue(dispatch, getState, loadCatalogueItems = API.loadCatalogueItems) {
    let state = getState(),
        projectId = state.get('appState').getIn(StatePaths.PROJECT_ID);

    dispatch({ type: Actions.CATALOGUE_UPDATE });

    return loadCatalogueItems(projectId, createRequest(state))
        .then(catalog => {
            dispatch({
                type: Actions.CATALOGUE_UPDATED,
                items: catalog.catalog,
                totals: catalog.totals
            });
        });
}

export function catalogueItemDetailRequested(item, projectId, loadItemDetails = loadDetails) {
    return dispatch => {
        dispatch({ type: Actions.ITEM_DETAIL_REQUEST });

        return loadItemDetails(item, projectId).then(data => dispatch({
            type: Actions.ITEM_DETAIL_DATA,
            detail: data,
            itemId: item.identifier
        }));
    };
}

const debouncedRequestCatalogue = debounce(requestCatalogue, 500);

export function setCatalogueQuery(query, loadCatalogItems = API.loadCatalogueItems) {
    return (dispatch, getState) => {
        dispatch({ type: Actions.CATALOGUE_SET_QUERY, query });

        debouncedRequestCatalogue(dispatch, getState, loadCatalogItems);
    };
}

export function setCatalogueFilter(index, loadCatalogueItems = API.loadCatalogueItems) {
    return (dispatch, getState) => {
        dispatch({ type: Actions.CATALOGUE_SET_ACTIVE_FILTER_INDEX, index });

        requestCatalogue(dispatch, getState, loadCatalogueItems);
    };
}

export function setCatalogueActiveDataset(datasetId, loadCatalogueItems = API.loadCatalogueItems) {
    return (dispatch, getState) => {
        dispatch({ type: Actions.CATALOGUE_SET_ACTIVE_DATASET_ID, datasetId });

        requestCatalogue(dispatch, getState, loadCatalogueItems);
    };
}

export function catalogueRequested(projectId, loadCatalogue = API.loadCatalogue) {
    return (dispatch, getState) => {
        dispatch({ type: Actions.CATALOGUE_UPDATE });

        return loadCatalogue(projectId, createRequest(getState()))
            .then(({ catalog, dateDimensions }) => {
                dispatch({
                    type: Actions.DATE_DIMENSIONS_DATA,
                    dateDimensions
                });

                dispatch({
                    type: Actions.CATALOGUE_UPDATED,
                    items: catalog.catalog,
                    totals: catalog.totals
                });
            });
    };
}

export function datasetsRequested(projectId, loadDatasets = API.loadDatasets) {
    return (dispatch, getStore) => {
        let userUri = getUserUri(getStore().get('appState'));

        return loadDatasets(projectId)
            .then(datasets => {
                dispatch({
                    type: Actions.DATASETS_DATA,
                    datasets: groupDatasets(datasets, userUri)
                });
            });
    };
}
