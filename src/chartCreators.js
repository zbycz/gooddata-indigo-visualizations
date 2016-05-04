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
    getChartData,
    getColorPalette
} from './transformation';

import {
    colors2Object,
    numberFormat
} from 'gdc-numberjs/lib/number';

export function propertiesToHeaders(config, _headers) { // TODO export for test only
    let { headers } = enrichHeaders(_headers);
    const res = keys(config).reduce(function(result, field) {
        var fieldContent = get(config, field);
        return set(result, field, find(headers, ['uri', fieldContent]));
    }, {});
    return res;
}

export function getIndices(config, headers) { // TODO export only for test
    var headerUris = map(headers, 'uri');
    var metric = indexOf(headerUris, '/metricValues');
    var category = indexOf(headerUris, config.x);
    var series = indexOf(headerUris, config.color);

    return { metric, category, series };
}

export function isMetricNamesInSeries(config, headers) { // TODO export only for test
    return get(propertiesToHeaders(config, headers), 'color.id') === 'metricNames';
}

export function getLineFamilyChartData(config, rawData) {
    var data = transformData(rawData);

    // prepare series, categories and data
    var indices = getIndices(config, data.headers);

    // configure transformation. Sort data only if metric names not in series.
    var configuration = {
        indices,
        sortSeries: !isMetricNamesInSeries(config, data.headers)
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

const unEscapeAngleBrackets = str => str && str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export function generateTooltipFn(options) {
    const { categoryAxisLabel } = options;
    const formatValue = (val, format) => {
        return colors2Object(numberFormat(val, format));
    };

    return function(point) {
        const formattedValue = escape(formatValue(point.y, point.format).label);
        const category = isNumber(point.category) ? '' :
            escape(unEscapeAngleBrackets(point.category));

        return `<table class="tt-values"><tr>
            <td class="title">${escape(categoryAxisLabel)}</td>
            <td class="value">${category}</td>
        </tr>
        <tr>
            <td class="title">${escape(unEscapeAngleBrackets(point.series.name))}</td>
            <td class="value">${formattedValue}</td>
        </tr></table>`;
    };
}

export var DEFAULT_COLOR_PALETTE = [
    'rgb(00,131,255)',
    'rgb(00,192,142)',
    'rgb(241,35,61)',
    'rgb(239,134,00)',
    'rgb(188,90,178)',

    'rgb(250,205,8)',
    'rgb(148,161,173)',
    'rgb(93,188,255)',
    'rgb(216,141,206)',
    'rgb(242,115,115)',

    'rgb(254,178,92)',
    'rgb(137,216,187)',
    'rgb(0,107,184)',
    'rgb(0,131,96)',
    'rgb(173,11,33)',

    'rgb(177,100,0)',
    'rgb(133,54,125)',
    'rgb(194,229,255)',
    'rgb(201,238,225)',
    'rgb(250,208,211)'
];

export function getLineFamilyChartOptions(config, data) {
    const categoryAxisLabel = getCategoryAxisLabel(config, data.headers);
    const metricAxisLabel = getMetricAxisLabel(config, data.headers);

    return {
        type: config.type,
        stacking: config.stacking,
        colorPalette: getColorPalette(data, config.colorPalette || DEFAULT_COLOR_PALETTE),
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
