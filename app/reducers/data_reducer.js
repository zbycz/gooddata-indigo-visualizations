import { fromJS } from 'immutable';

import * as Actions from '../constants/Actions';
import * as StatePaths from '../constants/StatePaths';

export default (state, action) => {
    switch (action.type) {
        case Actions.CATALOGUE_UPDATE:
            return state.setIn(StatePaths.CATALOGUE_LOADING, true);

        case Actions.CATALOGUE_SET_ACTIVE_FILTER_INDEX:
            return state.setIn(StatePaths.CATALOGUE_ACTIVE_FILTER_INDEX, action.index);

        case Actions.CATALOGUE_SET_QUERY:
            return state.setIn(StatePaths.CATALOGUE_QUERY, action.query);

        case Actions.CATALOGUE_SET_ACTIVE_DATASET_ID:
            return state.setIn(StatePaths.CATALOGUE_ACTIVE_DATASET_ID, action.datasetId);

        case Actions.CATALOGUE_UPDATED:
            return state
                .setIn(StatePaths.CATALOGUE_LOADING, false)
                .setIn(StatePaths.CATALOGUE_ITEMS, fromJS(action.items))
                .setIn(StatePaths.CATALOGUE_TOTALS, fromJS(action.totals));

        case Actions.ITEM_DETAIL_DATA:
            return state.setIn(
                StatePaths.CATALOGUE_ITEMS,
                state.getIn(StatePaths.CATALOGUE_ITEMS).map(item =>
                    item.get('identifier') === action.itemId ?
                    item.merge(fromJS({ details: action.detail })) :
                    item
                )
            );

        case Actions.DATASETS_DATA:
            return state.setIn(StatePaths.DATASETS, fromJS(action.datasets));

        case Actions.DATE_DIMENSIONS_DATA:
            return state.setIn(StatePaths.DIMENSIONS, fromJS(action.dateDimensions));

        default:
            return state;
    }
};
