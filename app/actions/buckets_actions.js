import * as Actions from '../constants/Actions';
import buildMessage from '../utils/message_builder';

export const selectVisualizationType =
    (type) => buildMessage(Actions.BUCKETS_SELECT_VISUALIZATION_TYPE, type);

export const setBucketItemCollapsed =
    (payload) => buildMessage(Actions.BUCKETS_SET_BUCKET_ITEM_COLLAPSED, payload);

export const setBucketItemAggregation =
    (payload) => buildMessage(Actions.BUCKETS_SET_BUCKET_ITEM_AGGREGATION, payload);

export const setBucketItemShowInPercent =
    (payload) => buildMessage(Actions.BUCKETS_SET_BUCKET_ITEM_SHOW_IN_PERCENT, payload);

export const setBucketItemShowPop =
    (payload) => buildMessage(Actions.BUCKETS_SET_BUCKET_ITEM_SHOW_POP, payload);

export const setBucketItemDimension =
    (payload) => buildMessage(Actions.BUCKETS_SET_BUCKET_ITEM_DIMENSION, payload);

export const setBucketItemGranularity =
    (payload) => buildMessage(Actions.BUCKETS_SET_BUCKET_ITEM_GRANULARITY, payload);
