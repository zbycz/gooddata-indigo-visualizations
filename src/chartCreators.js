import map from 'lodash/map';
import indexOf from 'lodash/indexOf';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import keys from 'lodash/keys';
import includes from 'lodash/includes';
import isNumber from 'lodash/isNumber';
import escape from 'lodash/escape';

import {
    transformData,
    enrichHeaders,
    getChartData
} from './transformation';

import {
    colors2Object,
    numberFormat
} from 'gdc-numberjs/lib/number';

export function propertiesToHeaders(config, _headers) { // TODO export for test only
    let { headers } = enrichHeaders(_headers);
    const res = keys(config).reduce(function(result, field) {
        var fieldContent = get(config, field);
        return set(result, field, find(headers, ['id', fieldContent]));
    }, {});
    return res;
}

export function getIndices(config, headers) { // TODO export only for test
    var headerIndices = map(headers, 'id');
    var metric = indexOf(headerIndices, 'metricValues');
    var category = indexOf(headerIndices, config.x);
    var series = indexOf(headerIndices, config.color);

    return { metric, category, series };
}

export function isMetricNamesInSeries(config, headers) { // TODO export only for test
    return !(get(propertiesToHeaders(config, headers), 'color.id') === 'metricNames');
}

export function getLineFamilyChartData(config, rawData) {
    var data = transformData(rawData);

    // prepare series, categories and data
    var indices = getIndices(config, data.headers);

    // configure transformation. Sort data only if metric names not in series.
    var configuration = {
        indices,
        sortSeries: isMetricNamesInSeries(config, data.headers)
    };

    return getChartData(data, configuration);
}

export function getLegendLayout(config, headers) { // TODO export only for test
    return (isMetricNamesInSeries(config, headers)) ? 'horizontal' : 'vertical';
}

export function getCategoryAxisLabel(config, headers) { // TODO export only for test
    return get(propertiesToHeaders(config, headers), 'x.title', '');
}

export function getMetricAxisLabel(config, headers) {
    var metrics = get(propertiesToHeaders(config, headers), 'color.metrics', []);

    if (!metrics.length) {
        return get(propertiesToHeaders(config, headers), 'y.title', '');
    } else if (metrics.length === 1) {
        return get(metrics, '0.header.title', '');
    }

    return '';
}

export function showInPercent(config, headers) { // TODO export only for test
    return includes(get(propertiesToHeaders(config, headers), 'y.format', ''), '%');
}

let unEscapeAngleBrackets = (str) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

function generateTooltipFn(options) {
    const { categoryAxisLabel } = options;
    const formatValue = (val, format) => {
        return colors2Object(numberFormat(val, format));
    };

    return function(point) {
        const formattedValue = escape(formatValue(point.y, point.format).label);

        return `<table class="tt-values"><tr>
            <td class="title">${escape(categoryAxisLabel)}</td>
            <td class="value">${isNumber(point.category) ? '' : escape(point.category)}</td>
        </tr>
        <tr>
            <td class="title">${escape(unEscapeAngleBrackets(point.series.name))}</td>
            <td class="value">${formattedValue}</td>
        </tr></table>`;
    };
}

export function getLineFamilyChartOptions(config, data) {
    const categoryAxisLabel = getCategoryAxisLabel(config, data.headers);
    const metricAxisLabel = getMetricAxisLabel(config, data.headers);

    return {
        type: config.type,
        stacking: config.stacking,
        colorPalette: config.colorPalette,
        legendLayout: getLegendLayout(config, data.headers),
        actions: {
            tooltip: generateTooltipFn({
                categoryAxisLabel
                // TODO: pass formatValue fn here
            })
        },
        title: {
            x: categoryAxisLabel,
            y: metricAxisLabel,
            yFormat: get(propertiesToHeaders(config, data.headers), 'y.format')
        },
        showInPercent: showInPercent(config, data.headers)
    };
}
