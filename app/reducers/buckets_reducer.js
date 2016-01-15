import { List, fromJS } from 'immutable';

import * as Actions from '../constants/Actions';
import * as Paths from '../constants/StatePaths';

import { CONFIGURATIONS, INITIAL_MODEL } from '../models/bucket';
import { bucketItem } from '../models/bucket_item';

function selectVisualizationType(state, type) {
    let config = CONFIGURATIONS[type] || CONFIGURATIONS.default;
    return state
        .setIn(Paths.VISUALIZATION_TYPE, type)
        .setIn(Paths.BUCKETS,
            state.getIn(Paths.BUCKETS).map((bucket, idx) => {
                let bucketConfig = config[bucket.get('keyName')],
                    initialConfig = INITIAL_MODEL[idx];

                let newBucket = (typeof bucketConfig === 'object') ?
                    bucket.merge(fromJS(Object.assign(initialConfig, bucketConfig, { enabled: true }))) :
                    bucket.set('enabled', bucketConfig !== false);

                if (!newBucket.get('items').size) { // TODO: remove and implement dnd
                    let catalogueItems = state.getIn(Paths.CATALOGUE_ITEMS);
                    if (catalogueItems) {
                        catalogueItems =
                            catalogueItems.filter(item => item.get('type') === 'fact').slice(0, 3)
                                .concat(catalogueItems.filter(item => item.get('type') === 'metric').slice(0, 3))
                                .concat(catalogueItems.filter(item => item.get('type') === 'attribute').slice(0, 3))
                                .map(attribute => bucketItem({ attribute: attribute.get('id') }));
                    }

                    return newBucket
                        .set('items', List([bucketItem({ attribute: 'dimensions' })]).concat(catalogueItems));
                }

                return newBucket;
            })
        );
}

function getBucketItemIndexes(state, payload) {
    let buckets = state.getIn(Paths.BUCKETS),
        bucketIdx, itemIdx;

    bucketIdx = buckets.findIndex((bucket) => {
        itemIdx = bucket.get('items').findIndex((item) => item === payload.item);
        return itemIdx >= 0;
    });

    return { buckets, bucketIdx, itemIdx };
}

function setBucketItemCollapsed(state, payload) {
    let { buckets, bucketIdx } = getBucketItemIndexes(state, payload);
    return buckets.getIn([bucketIdx, 'keyName']) === 'metrics' ?
        state.setIn(
            Paths.BUCKETS.concat([bucketIdx, 'items']),
            buckets.getIn([bucketIdx, 'items']).map(item =>
                item.set('collapsed', item === payload.item ? payload.collapsed : true)
            )
        ) :
        state;
}

function setBucketItemProperty(property, state, payload) {
    let { bucketIdx, itemIdx } = getBucketItemIndexes(state, payload);

    return state.setIn(
        Paths.BUCKETS.concat([bucketIdx, 'items', itemIdx, property]),
        payload.value
    );
}

function setBucketItemAddFilter() {
}

function setBucketItemRemoveFilter() {
}

let handlers = {
    [Actions.BUCKETS_SELECT_VISUALIZATION_TYPE]: selectVisualizationType,
    [Actions.BUCKETS_SET_BUCKET_ITEM_COLLAPSED]: setBucketItemCollapsed,
    [Actions.BUCKETS_SET_BUCKET_ITEM_AGGREGATION]: setBucketItemProperty.bind(null, 'aggregation'),
    [Actions.BUCKETS_SET_BUCKET_ITEM_SHOW_IN_PERCENT]: setBucketItemProperty.bind(null, 'showInPercent'),
    [Actions.BUCKETS_SET_BUCKET_ITEM_SHOW_POP]: setBucketItemProperty.bind(null, 'showPoP'),
    [Actions.BUCKETS_SET_BUCKET_ITEM_DIMENSION]: setBucketItemProperty.bind(null, 'dimension'),
    [Actions.BUCKETS_SET_BUCKET_ITEM_GRANULARITY]: setBucketItemProperty.bind(null, 'granularity'),
    [Actions.BUCKETS_SET_BUCKET_ITEM_ADD_FILTER]: setBucketItemAddFilter,
    [Actions.BUCKETS_SET_BUCKET_ITEM_REMOVE_FILTER]: setBucketItemRemoveFilter
};

export default (state, action) => {
    let handler = handlers[action.type];
    return handler ? handler(state, action.payload) : state;
};
