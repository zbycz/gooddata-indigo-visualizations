import map from 'lodash/map';
import indexOf from 'lodash/indexOf';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import keys from 'lodash/keys';
import includes from 'lodash/includes';

import {
    _transformMetrics,
    transformData,
    getChartData
} from './transformation';

export function propertiesToHeaders(config, data) { // TODO export for test only

    let headers = transformData(data).headers;
    const res = keys(config).reduce(function(result, field) {
        var fieldContent = get(config, field);
        return set(result, field, find(headers, ['id', fieldContent]));
    }, {});
    return res;
}

function getIndices(config, headers) {
    var headerIndices = map(headers, 'id');
    var metric = indexOf(headerIndices, 'metricValues');
    var category = indexOf(headerIndices, config.x);
    var series = indexOf(headerIndices, config.color);

    return { metric, category, series };
}

function isMetricNamesInSeries(config, data) {
    return !(get(propertiesToHeaders(config, data), 'color.id') === 'metricNames');
}

export function getColumnChartData(config, rawData) {
    var data = transformData(rawData);
    if (!data || data.isLoading) return false; // TODO handle errors

    // TODO
    // reset data error flags, for example if new data is large, it will be reported
    // from the chart itself again
    // this.resetErrors();

    // prepare series, categories and data
    var indices = getIndices(config, data.headers);

    // configure transformation. Sort data only if metric names not in series.
    var configuration = {
        indices,
        sortSeries: isMetricNamesInSeries(config, data)
    };

    return getChartData(data, configuration);
}

function getLegendLayout(config, data) {
    return (isMetricNamesInSeries(config, data)) ? 'horizontal' : 'vertical';
}

function getCategoryAxisLabel(config, data) {
    return get(propertiesToHeaders(config, data), 'x.title', '');
}

function getMetricAxisLabel(config, data) {
    var metrics = get(propertiesToHeaders(config, data), 'color.metrics', []);

    if (!metrics.length) {
        return get(propertiesToHeaders(config, data), 'y.title', '');
    } else if (metrics.length === 1) {
        return get(metrics, '0.header.title', '');
    }

    return '';
}

function showInPercent(config, data) {
    return includes(get(propertiesToHeaders(config, data), 'y.format', ''), '%');
}

export function getColumnChartOptions(config, data) {
    return {
        type: 'column',
        // stacking: controller.get('properties.stacking'),
        stacking: false, // TODO
        colorPalette: config.colorPalette,
        legendLayout: getLegendLayout(config, data),
        // actions: {
        //     tooltip: this.get('tooltip').bind(this),
        //     error: this.get('error').bind(this)
        // },
        title: {
            x: getCategoryAxisLabel(config, data),
            y: getMetricAxisLabel(config, data),
            yFormat: get(propertiesToHeaders(config, data), 'y.format')
        },
        showInPercent: showInPercent(config, data)
    };
}
