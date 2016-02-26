export function transformConfigToLine(config) {
    const stacking = config.buckets.stacks.length;

    if (!stacking) {
        return {
            type: config.visualizationType,
            x: config.buckets.categories[0].dfIdentifier,
            y: 'metricValues',
            color: 'metricNames',
            stacking: false,
            // TODO: do the following only matter for data
            where: {},
            orderBy: []
            // TODO: where to take colorPalette from?
        };
    }
    return {
        type: config.visualizationType,
        x: config.buckets.categories[0].dfIdentifier,
        y: 'metricValues',
        color: config.buckets.stacks[0].dfIdentifier,
        stacking: true,
        // TODO: do the following only matter for data
        where: {},
        orderBy: []
        // TODO: where to take colorPalette from?
    };
}
