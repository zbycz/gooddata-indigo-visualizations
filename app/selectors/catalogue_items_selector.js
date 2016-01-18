import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { t } from '../utils/translations';
import * as StatePaths from '../constants/StatePaths';
import activeFilterSelector from './active_filter_selector';

function isDateVisible(activeFilter, query, dimensions = []) {
    return activeFilter.get('types').contains('attribute') && !query && dimensions.size;
}

export default createSelector(
    state => state.getIn(StatePaths.CATALOGUE_ITEMS),
    activeFilterSelector,
    state => state.getIn(StatePaths.CATALOGUE_QUERY),
    state => state.getIn(StatePaths.DIMENSIONS_AVAILABLE),
    (items, activeFilter, query, dimensions) => {
        let decoratedItems = items;

        if (decoratedItems.size) {
            decoratedItems = decoratedItems.unshift(fromJS({
                identifier: 'project_data_item',
                isGroupHeader: true,
                type: 'header'
            }));
        }

        if (isDateVisible(activeFilter, query, dimensions)) {
            decoratedItems = decoratedItems.unshift(fromJS({
                identifier: 'date_dimensions',
                title: 'Date',
                type: 'date',
                isAvailable: true,
                summary: t('dashboard.catalogue_item.common_date_description')
            }));
        }

        return decoratedItems;
    }
);
