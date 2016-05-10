import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import compact from 'lodash/compact';
import findIndex from 'lodash/findIndex';
import uniqBy from 'lodash/uniqBy';
import times from 'lodash/times';
import constant from 'lodash/constant';
import filter from 'lodash/filter';

// default format used when creating metric
export const DEFAULT_FORMAT = '#,##0.00';

/**
 * Splits metrics to two separate groups.
 *
 * One group contains all the metric headers, the other contains everything else.
 */
export function _splitHeaders(headers) {
    var metrics = [],
        newHeaders = [];

    headers.forEach(function(header, i) {
        if (header.type === 'metric') {
            metrics.push({
                index: i,
                header
            });
        } else {
            newHeaders.push(header);
        }
    });

    return {
        headers: newHeaders,
        metrics
    };
}

export function getMetricNamesValuesHeaderItems(headers, metrics) {
    // Need to transform the headers to match the rawData transformation
    return [{
        id: 'metricNames',
        title: 'Metric',
        type: 'attrLabel',
        uri: '/metricGroup',
        metrics
    }, {
        id: 'metricValues',
        type: 'metric',
        uri: '/metricValues',

        // For axis formatting, use first metric's formatting.
        // For individual series tooltips and labels, formats are
        // handled separately in metricNames
        format: get(metrics, '0.header.format', DEFAULT_FORMAT),

        // use first metric title as default
        title: get(metrics, '0.header.title', '')
    }];
}

function addMetricNamesValues(headers, metrics) {
    return {
        headers: headers.concat(getMetricNamesValuesHeaderItems(headers, metrics)),
        metrics
    };
}

export function enrichHeaders(_headers) {
    const { headers, metrics } = _splitHeaders(_headers);

    return addMetricNamesValues(headers, metrics);
}

export function _transposeData(headers, metrics, rawData) {
    var data = [];

    for (var mi = 0; mi < metrics.length; mi++) {
        for (var ri = 0; ri < rawData.length; ri++) {
            var row = [];

            for (var ci = 0; ci < headers.length; ci++) {
                if (headers[ci].type === 'attrLabel') {
                    var value = rawData[ri][ci];
                    row.push({
                        id: value,
                        value
                    });
                }
            }

            var metric = metrics[mi];
            row.push({
                id: 'metric-' + mi, // let each metric have unique id
                value: metric.header.title
            });

            var metricValue = rawData[ri][metric.index],
                parsedValue = parseFloat(metricValue);

            row.push({
                format: metric.header.format || DEFAULT_FORMAT,
                y: isNaN(parsedValue) ? null : parsedValue
            });

            data.push(row);
        }
    }

    return data;
}

/**
 * For multiple metrics data transform |A1|A2|M1|M2|M3| format
 * into a |A1|A2|metricNames|metricValues| format where all the metrics
 * are put underneath itself and the metricNames acts as a report-local
 * artificial attribute with individual metric names are its values
 *
 * Note: output is wrapped into an object having `id` and `value` keys
 * for the purposes of determining unique elements
 *
 * Example:
 * <pre>
 *
 *   Input
 *
 *     A1  A2    M1     M2
 *    -----------------------
 *      u   d   1111   2333
 *      u   e   1112   2334
 *      v   o   1121   2345
 *      v   p   1122   2346
 *      v   q   1123   2347
 *
 *   Output
 *
 *     A1  A2  metricNames metricValues
 *    ----------------------------------
 *      u   d       M1         1111    // first metric
 *      u   e       M1         1112
 *      v   o       M1         1121
 *      v   p       M1         1122
 *      v   q       M1         1123
 *      u   d       M2         2333    // second metric
 *      u   e       M2         2334
 *      v   o       M2         2345
 *      v   p       M2         2346
 *      v   q       M2         2347
 *
 * </pre>
 **/
export function _transformMetrics(data) {
    // don't modify original data structure
    var dataCopy = cloneDeep(data);

    var { headers, metrics } = enrichHeaders(dataCopy.headers);

    if (metrics.length < 1) return dataCopy;

    var transposedData = _transposeData(dataCopy.headers, metrics, dataCopy.rawData);

    dataCopy.rawData = transposedData;
    dataCopy.headers = headers;
    return dataCopy;
}

export function transformData(data) {
    if (!data || data.isLoading) return data;

    return _transformMetrics(data);
}

// get unique elements for given index regarding their interal id
export function _getElements(data, index) {
    return uniqBy(map(data.rawData, index), 'id');
}

// get series data
export function _getSeries(data, seriesNames, categories, indices) {
    var seriesData = seriesNames.reduce((acc, series) => {
        acc[series.id] = times( // eslint-disable-line no-param-reassign
            categories.length,
            constant(null)
        );
        return acc;
    }, {});

    // prepare data points
    data.rawData.forEach(function(dataRow) {
        var categoryItemIndex = 0;
        if (indices.category !== -1) {
            var categoryItemId = dataRow[indices.category].id;
            categoryItemIndex = findIndex(categories, ['id', categoryItemId]);
        }

        if (indices.series !== -1) {
            seriesData[dataRow[indices.series].id][categoryItemIndex] = dataRow[indices.metric];
        }
    });

    // return series in the same order as requested in seriesNames
    return seriesNames.map(function(name, index) {
        return {
            name: name.value,
            legendIndex: index,
            data: seriesData[name.id]
        };
    });
}

function lighter(color, percent) {
    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent);

    return Math.round((t - color) * p) + color;
}

function formatColor(red, green, blue) {
    return `rgb(${red},${green},${blue})`;
}

/**
 * Source:
 *     http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 */
export function _getLighterColor(color, percent) {
    var f = color.split(','),
        R = parseInt(f[0].slice(4), 10),
        G = parseInt(f[1], 10),
        B = parseInt(f[2], 10);

    return formatColor(
        lighter(R, percent),
        lighter(G, percent),
        lighter(B, percent)
    );
}

export function getColorPalette(data, palette) {
    let newPalette = cloneDeep(palette);

    filter(data.headers, header => header.type === 'metric')
        .forEach((metric, idx) => {
            if (metric.id && metric.id.match(/\.generated\.pop\./)) {
                const color = _getLighterColor(newPalette[idx % newPalette.length], 0.6);
                newPalette.splice(idx, 0, color);
            }
        });

    return newPalette;
}

/**
 * Get highcharts-compatible charting data from the data which
 * already passed a metricNames+metricValues transformation
 * Needs configuration for categories/series and metric values
 *
 * Input
 * Example:
 * <pre>
 *
 *   Input
 *
 *     A  metricNames metricValues
 *    ------------------------------
 *     a       M1         1111    // first metric
 *     b       M1         1112
 *     c       M1         1121
 *     a       M2         2333    // second metric
 *     b       M2         2334
 *     c       M2         2345
 *
 *   Input configuration:
 *      sort: false,
 *      indices: {
 *          categories: 0,
 *          series: 1,
 *          metric: 2
 *      }
 *
 * </pre>
 *
 * Output
 * Example:
 *      {
 *          categories: ['a', 'b', 'c'],
 *          series: [
 *              {
 *                  name: 'M1',
 *                  data: [ { y: 1111 }, { y: 1112 }, { y: 1121 } ]
 *              },
 *              {
 *                  name: 'M2',
 *                  data: [ { y: 2333 }, { y: 2334 }, { y: 2345 } ]
 *              }
 *          ]
 *      }
 * <pre>
 *
 * </pre>
 **/
export function getChartData(data, configuration) {
    var indices = configuration.indices;

    var categories = _getElements(data, indices.category);
    var seriesNames = _getElements(data, indices.series);

    var seriesNamesSorted = configuration.sortSeries ? sortBy(seriesNames, 'value') : seriesNames;
    var seriesNamesCompact = compact(seriesNamesSorted);

    var seriesData = _getSeries(data, seriesNamesCompact, categories, indices);

    return {
        categories: map(categories, 'value'),
        series: seriesData
    };
}
