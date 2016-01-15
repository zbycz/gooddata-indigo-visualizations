import { List, Record } from 'immutable';
import { decoratedBucketItem } from './bucket_item';

export const INITIAL_MODEL = [
    {
        keyName: 'metrics',
        accepts: ['metric', 'fact', 'attribute'],
        itemsLimit: 20,
        enabled: true,
        items: []
    },
    {
        keyName: 'categories',
        allowsSwapping: true,
        accepts: ['attribute', 'date'],
        itemsLimit: 1,
        enabled: true,
        items: []
    },
    {
        keyName: 'filters',
        accepts: ['attribute', 'date'],
        allowsDuplicateItems: true,
        enabled: true,
        items: []
    },
    {
        keyName: 'stacks',
        accepts: ['attribute'],
        allowsSwapping: true,
        itemsLimit: 1,
        enabled: true,
        items: []
    }
];

export const CONFIGURATIONS = {
    table: {
        categories: {
            itemsLimit: 20
        },
        stacks: false
    },
    default: {
        categories: {
            itemsLimit: 1
        }
    }
};

let bucketBase = {
    keyName: null,
    accepts: List(),
    itemsLimit: 20,
    enabled: true,
    items: List()
};

let DecoratedBucket = Record(bucketBase);

export function decoratedBucket(bucket, catalogue, dimensions, categories) {
    return new DecoratedBucket(bucket.set(
        'items',
        bucket.get('items')
            .map(item => decoratedBucketItem(item, catalogue, dimensions, categories)
                .set('isMetric', bucket.get('keyName') === 'metrics')
            )
    ));
}

export function decoratedBuckets(buckets, catalogue, dimensions) {
    let categories = decoratedBucket(
        buckets.filter(bucket => bucket.get('keyName') === 'categories').first(),
        catalogue,
        dimensions,
        List()
    );

    return buckets.map(bucket =>
        bucket.get('keyName') === 'categories' ?
            categories :
            decoratedBucket(bucket, catalogue, dimensions, categories.get('items'))
    );
}
