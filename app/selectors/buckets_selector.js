import { createSelector } from 'reselect';

import * as Paths from '../constants/StatePaths';

import { decoratedDimensions } from '../models/dimension';
import { decoratedBuckets } from '../models/bucket';

const getBuckets = state => state.getIn(Paths.BUCKETS);
const getDimensions = state => state.getIn(Paths.DIMENSIONS);
const getCatalogue = state => state.getIn(Paths.CATALOGUE_ITEMS);
const getVisualizationType = state => state.getIn(Paths.VISUALIZATION_TYPE);
const getProjectId = state => state.get('appState').getIn(Paths.PROJECT_ID);

const getDecoratedDimensions = createSelector(getDimensions, decoratedDimensions);

const getDecoratedBuckets = createSelector(
    getBuckets,
    getCatalogue,
    getDecoratedDimensions,
    (buckets, catalogue, dimensions) => decoratedBuckets(buckets, catalogue, dimensions)
        .filter(bucket => bucket.get('keyName') !== 'filters')
);

export const bucketsSelector = createSelector(
    getDecoratedBuckets,
    getDecoratedDimensions,
    getVisualizationType,
    getProjectId,
    (buckets, dimensions, visualizationType, projectId) => ({ buckets, dimensions, visualizationType, projectId })
);
