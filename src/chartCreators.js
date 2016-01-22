import map from 'lodash/map';
import indexOf from 'lodash/indexOf';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import keys from 'lodash/keys';
import includes from 'lodash/includes';

import { transformData, getChartData } from './transformation';

function propertiesToHeaders(config, headers) {
    return keys(config).reduce(function(result, field) {
        var fieldContent = get(config, field);
        return set(result, field, find(headers, ['id', fieldContent]));
    }, {});
}

function getIndices(config, headers) {
    var headerIndices = map(headers, 'id');
    var metric = indexOf(headerIndices, 'metricValues');
    var category = indexOf(headerIndices, config.x);
    var series = indexOf(headerIndices, config.color);

    return { metric, category, series };
}

function isMetricNamesInSeries(config, headers) {
    return !(get(propertiesToHeaders(config, headers), 'color.id') === 'metricNames');
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
        sortSeries: isMetricNamesInSeries(config, data.headers)
    };

    return getChartData(data, configuration);
}

function getLegendLayout(config, headers) {
    return (isMetricNamesInSeries(config, headers)) ? 'horizontal' : 'vertical';
}

function getCategoryAxisLabel(config, headers) {
    return get(propertiesToHeaders(config, headers), 'x.title', '');
}

function getMetricAxisLabel(config, headers) {
    var metrics = get(propertiesToHeaders(config, headers), 'color.metrics', []);

    if (!metrics.length) {
        return get(propertiesToHeaders(config, headers), 'y.title', '');
    } else if (metrics.length === 1) {
        return get(metrics, '0.header.title', '');
    }

    return '';
}

function showInPercent(config, headers) {
    return includes(get(propertiesToHeaders(config, headers), 'y.format', ''), '%');
}

export function getColumnChartOptions(config, data) {
    return {
        type: 'column',
        // stacking: controller.get('properties.stacking'),
        stacking: false, // TODO
        colorPalette: config.colorPalette,
        legendLayout: getLegendLayout(config, data.headers),
        // actions: {
        //     tooltip: this.get('tooltip').bind(this),
        //     error: this.get('error').bind(this)
        // },
        title: {
            x: getCategoryAxisLabel(config, data.headers),
            y: getMetricAxisLabel(config, data.headers),
            yFormat: get(propertiesToHeaders(config, data.headers), 'y.format')
        },
        showInPercent: showInPercent(config, data.headers)
    };
}
