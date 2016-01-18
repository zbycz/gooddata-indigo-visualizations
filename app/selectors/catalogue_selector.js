import { createSelector } from 'reselect';
import * as StatePaths from '../constants/StatePaths';
import catalogueItemsSelector from './catalogue_items_selector';

export default createSelector(
    catalogueItemsSelector,
    state => state.getIn(StatePaths.CATALOGUE),
    state => state.getIn(StatePaths.DATASETS),
    state => state.get('appState').getIn(StatePaths.PROJECT_ID),
    state => state.get('appState').getIn(StatePaths.FEATURE_FLAGS).get('enableCsvUploader'),
    (items, catalogue, datasets, projectId, enableCsvUploader) => ({
        items,
        catalogue,
        datasets,
        projectId,
        enableCsvUploader
    })
);
