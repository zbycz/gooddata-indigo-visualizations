import {
    map,
    indexOf,
    get,
    set,
    find,
    keys,
    includes,
    isNumber,
    escape,
    sortBy,
    zip
} from 'lodash';

import {
    colors2Object,
    numberFormat
} from '@gooddata/numberjs';

import {
    transformData,
    enrichHeaders,
    getChartData,
    getColorPalette
} from './transformation';


export function propertiesToHeaders(config, _headers) { // TODO export for test only
    const { headers } = enrichHeaders(_headers);
    const res = keys(config).reduce((result, field) => {
        const fieldContent = get(config, field);
        return set(result, field, find(headers, ['uri', fieldContent]));
    }, {});
    return res;
}

export function getIndices(config, headers) { // TODO export only for test
    const headerUris = map(headers, 'uri');
    const metric = indexOf(headerUris, '/metricValues');
    const category = indexOf(headerUris, config.x);
    const series = indexOf(headerUris, config.color);

    return { metric, category, series };
}

export function isMetricNamesInSeries(config, headers) { // TODO export only for test
    return get(propertiesToHeaders(config, headers), 'color.id') === 'metricNames';
}

export function getLineFamilyChartData(config, rawData) {
    const data = transformData(rawData);

    // prepare series, categories and data
    const indices = getIndices(config, data.headers);

    // configure transformation. Sort data only if metric names not in series.
    const configuration = {
        indices,
        sortSeries: !isMetricNamesInSeries(config, data.headers)
    };

    return getChartData(data, configuration);
}

export function getPieFamilyChartData(config, data) {
    const { metricsOnly } = config;
    const sortDesc = ([, value]) => -value;

    function getMetricsOnlyData(executionData) {
        const { headers, rawData } = executionData;
        return zip(
            headers.map(header => header.title),
            rawData[0],
            headers.map(header => (header.format || ''))
        );
    }

    function getMetricAttrData(executionData) {
        const { headers, rawData } = executionData;
        const metricHeader = find(headers, header => header.type === 'metric');
        const format = get(metricHeader, 'format', '');

        return rawData.map(dataPoint => [...dataPoint, format]);
    }

    const unsortedData = metricsOnly ? getMetricsOnlyData(data) : getMetricAttrData(data);
    const sortedData = sortBy(unsortedData, sortDesc);

    return {
        series: [{
            data: sortedData.map(([name, y, format], i) =>
                ({ name, y: parseInt(y, 10), color: config.colorPalette[i], legendIndex: i, format }))
        }]
    };
}

export function getLegendLayout(config, headers) { // TODO export only for test
    return (isMetricNamesInSeries(config, headers)) ? 'horizontal' : 'vertical';
}

export function getCategoryAxisLabel(config, headers) { // TODO export only for test
    return get(propertiesToHeaders(config, headers), 'x.title', '');
}

export function getMetricAxisLabel(config, headers) {
    const metrics = get(propertiesToHeaders(config, headers), 'color.metrics', []);

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

    return (point) => {
        const formattedValue = escape(formatValue(point.y, point.format).label);
        const category = isNumber(point.category) ? '' :
            escape(unEscapeAngleBrackets(point.category));

        return `
            <table class="tt-values"><tr>
                <td class="title">${escape(categoryAxisLabel)}</td>
                <td class="value">${category}</td>
            </tr>
            <tr>
                <td class="title">${escape(unEscapeAngleBrackets(point.series.name))}</td>
                <td class="value">${formattedValue}</td>
            </tr></table>`;
    };
}

export function generatePieTooltipFn(options) {
    const { categoryLabel, metricLabel, metricsOnly } = options;
    const formatValue = (val, format) => {
        return colors2Object(numberFormat(val, format));
    };

    return (point) => {
        const formattedValue = escape(formatValue(point.y, point.format).label);
        const category = isNumber(point.name) ? '' :
            escape(unEscapeAngleBrackets(point.name));

        const categoryRow = !metricsOnly ? `<tr>
                <td class="title">${escape(categoryLabel)}</td>
                <td class="value">${category}</td>
            </tr>` : '';

        const metricTitle = metricsOnly ? point.name : metricLabel;

        return `
            <table class="tt-values">
                ${categoryRow}
                <tr>
                    <td class="title">${escape(metricTitle)}</td>
                    <td class="value">${formattedValue}</td>
                </tr>
            </table>`;
    };
}

export const DEFAULT_COLOR_PALETTE = [
    'rgb(20,178,226)',
    'rgb(0,193,141)',
    'rgb(229,77,66)',
    'rgb(241,134,0)',
    'rgb(171,85,163)',

    'rgb(244,213,33)',
    'rgb(148,161,174)',
    'rgb(107,191,216)',
    'rgb(181,136,177)',
    'rgb(238,135,128)',

    'rgb(241,171,84)',
    'rgb(133,209,188)',
    'rgb(41,117,170)',
    'rgb(4,140,103)',
    'rgb(181,60,51)',

    'rgb(163,101,46)',
    'rgb(140,57,132)',
    'rgb(136,219,244)',
    'rgb(189,234,222)',
    'rgb(239,197,194)'
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

export function getPieChartOptions(config, data) {
    const metricsOnly = !!(
        data.headers.length >= 2 &&
        data.headers.every(header => header.type === 'metric'));

    const attrHeader = data.headers.find(header => header.type === 'attrLabel');
    const metricHeader = data.headers.find(header => header.type === 'metric');

    const categoryLabel = attrHeader ? attrHeader.title : '';
    const metricLabel = metricHeader.title;

    return {
        type: config.type,
        chart: {
            height: config.height
        },
        colorPalette: getColorPalette(data, config.colorPalette || DEFAULT_COLOR_PALETTE),
        legendLayout: 'horizontal',
        actions: {
            tooltip: generatePieTooltipFn({
                categoryLabel,
                metricLabel,
                data,
                metricsOnly
            })
        },
        title: {
            x: categoryLabel,
            yFormat: get(propertiesToHeaders(config, data.headers), 'y.format')
        },
        showInPercent: showInPercent(config, data.headers),
        metricsOnly
    };
}
