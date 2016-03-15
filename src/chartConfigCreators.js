import some from 'lodash/some';

export function transformConfigToLine(config) {
    let isStacking = some(
        config.buckets.categories,
        {
            category: {
                collection: 'stack'
            }
        }
    );

    if (!isStacking) {
        return {
            type: config.type,
            x: config.buckets.categories[0].category.displayForm,
            y: '/metricValues',
            color: '/metricGroup',
            stacking: false,
            // TODO: do the following only matter for data
            where: {},
            orderBy: []
            // TODO: where to take colorPalette from?
        };
    }
    return {
        type: config.type,
        x: config.buckets.categories[0].category.displayForm,
        y: '/metricValues',
        color: config.buckets.categories[0].category.displayForm,
        stacking: true,
        // TODO: do the following only matter for data
        where: {},
        orderBy: []
        // TODO: where to take colorPalette from?
    };
}
